package com.ordering.orderservice.service;

import com.ordering.common.domain.OrderStatus;
import com.ordering.common.dto.*;
import com.ordering.common.event.OrderPaidEvent;
import com.ordering.common.exception.BadRequestException;
import com.ordering.common.exception.ResourceNotFoundException;
import com.ordering.orderservice.client.CartClient;
import com.ordering.orderservice.config.RabbitMQConfig;
import com.ordering.orderservice.entity.Order;
import com.ordering.orderservice.repository.OrderRepository;
import com.ordering.orderservice.util.IdGenerator;
import com.ordering.orderservice.entity.OrderItem;
import com.ordering.orderservice.repository.OrderItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartClient cartClient;
    private final RabbitTemplate rabbitTemplate;
    // for sharding
    private final IdGenerator idGenerator;


    @Override
    public Order createOrder(Long userId) {

        long orderId = idGenerator.nextId();

        ApiResponse<CartDTO> response = cartClient.getCart(userId.toString());
        CartDTO cart = response.getData();
        if (cart == null || cart.getItems().isEmpty()) {
            throw new ResourceNotFoundException("Cart is empty");
        }
        //1, create order
        Order order = new Order();
        order.setId(orderId);// assigned first
        System.out.println("Creating order with ID = " + orderId);
        order.setUserId(userId);
        order.setTotalAmount(cart.getTotalPrice());
        order.setStatus(OrderStatus.CREATED);
        Order savedOrder = orderRepository.save(order);
        //2, save order item
        for (CartItemDTO item : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setId(idGenerator.nextId()); // assign id
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setMenuItemId(item.getMenuItemId());
            orderItem.setName(item.getName());
            orderItem.setPrice(item.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItemRepository.save(orderItem);
        }

        System.out.println("Saving order item, orderId = " + orderId);
        //3. clear cart
        cartClient.clearCart(userId.toString());

        return savedOrder;
    }

    @Override
    @Transactional
    public Order payOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (order.getStatus() != OrderStatus.CREATED) {
            throw new BadRequestException("Order cannot be paid");
        }
        // simulate payment issue
        order.setStatus(OrderStatus.PAID);
        Order saved = orderRepository.save(order);

        // publish event
        OrderPaidEvent event = new OrderPaidEvent();
        event.setOrderId(saved.getId());
        event.setUserId(saved.getUserId());
        event.setTotalAmount(saved.getTotalAmount());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ORDER_EXCHANGE,
                RabbitMQConfig.ORDER_PAID_KEY,
                event
        );
        return saved;
    }

    @Override
    public OrderDTO getOrderById(Long orderId, Long userId) {
        Order order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        List<OrderItemDTO> items = orderItemRepository.findByOrderId(order.getId())
                .stream().map(this::apply).toList();
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(items);
        return dto;
    }

    @Override
    public Page<OrderDTO> getMyOrders(Long userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return orders.map(this::convertToDto);
    }

    @Override
    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (order.getStatus() != OrderStatus.CREATED) {
            throw new BadRequestException("Only CREATED orders can be cancelled");
        }
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Override
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToDto);
    }

    @Override
    public Page<OrderDTO> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                .map(this::convertToDto);
    }

    private OrderDTO convertToDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(orderItemRepository.findByOrderId(order.getId())
                .stream()
                .map(this::apply).toList()
        );
        return dto;
    }

    private OrderItemDTO apply(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setMenuItemId(item.getMenuItemId());
        dto.setName(item.getName());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        return dto;
    }
}
