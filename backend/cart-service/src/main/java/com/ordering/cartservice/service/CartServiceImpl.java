package com.ordering.cartservice.service;

import com.ordering.cartservice.client.MenuClient;
import com.ordering.common.dto.ApiResponse;
import com.ordering.common.dto.CartDTO;
import com.ordering.common.dto.CartItemDTO;
import com.ordering.common.dto.MenuItemDTO;
import com.ordering.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final RedisTemplate<String, Object> redisTemplate;
    private  final MenuClient menuClient;
    private static final String CART_KEY_PREFIX = "cart:";
    private static final long CART_TTL_MINUTES = 30;

    private String cartKey(Long userId) {
        return CART_KEY_PREFIX + userId;
    }

    @Override
    public CartDTO getCart(Long userId) {
        String key = cartKey(userId);
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
        List<CartItemDTO> items = entries.values().stream().
                map(v -> (CartItemDTO) v).toList();
        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // set/ refresh TTL
        redisTemplate.expire(key, CART_TTL_MINUTES, TimeUnit.MINUTES);

        return new CartDTO(userId, items, total);
    }

    @Override
    public void addItemToCart(Long userId, CartItemDTO item) {
        if (item.getMenuItemId() == null) {
            throw  new IllegalArgumentException("menuItemId is required");
        }
        // fetch menu item from menu-service
        ApiResponse<MenuItemDTO> response = menuClient.getMenuItem(item.getMenuItemId());
        MenuItemDTO menuItem  = response.getData();
        if (menuItem == null || !menuItem.isAvailable()) {
            throw new ResourceNotFoundException("Menu item not available");
        }
        item.setName(menuItem.getName());
        item.setPrice(menuItem.getPrice());

        String key = cartKey(userId);
        redisTemplate.opsForHash().put(key, item.getMenuItemId().toString(), item);

        // set/ refresh TTL
        redisTemplate.expire(key, CART_TTL_MINUTES, TimeUnit.MINUTES);
    }

    @Override
    public void updateItem(Long userId, Long itemId, Integer quantity) {
        String key = cartKey(userId);
        CartItemDTO item = (CartItemDTO) redisTemplate.opsForHash()
                .get(key, itemId.toString());
        if (item == null) {
            throw new ResourceNotFoundException("Item not found in cart");
        }
        item.setQuantity(quantity);
        redisTemplate.opsForHash().put(key, itemId.toString(), item);
        // set/ refresh TTL
        redisTemplate.expire(key, CART_TTL_MINUTES, TimeUnit.MINUTES);
    }

    @Override
    public void removeItem(Long userId, Long itemId) {
        redisTemplate.opsForHash().delete(cartKey(userId), itemId.toString());
    }

    @Override
    public void clearCart(Long userId) {
        redisTemplate.delete(cartKey(userId));
    }
}
