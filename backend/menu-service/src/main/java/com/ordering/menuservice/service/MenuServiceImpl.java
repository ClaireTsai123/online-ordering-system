package com.ordering.menuservice.service;

import com.ordering.common.dto.MenuItemDTO;
import com.ordering.common.exception.ResourceNotFoundException;
import com.ordering.menuservice.entity.MenuItem;
import com.ordering.menuservice.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {
    private final MenuItemRepository menuItemRepository;

    @Override
    @Cacheable(value = "menu:all")
    public List<MenuItemDTO> getAllAvailableItems() {
        System.out.println(".....hitting db......");
        return menuItemRepository.findByAvailableTrue().stream()
                .map(this::convertToDTO).toList();
    }


    @Cacheable(value = "menu:all", key = "#id")
    @Override
    public MenuItemDTO getItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        return convertToDTO(item);
    }

    @Override
    public List<MenuItemDTO> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category.toLowerCase()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "menu:all", allEntries = true)
    @Override
    public MenuItemDTO createItem(MenuItem item) {
        MenuItem saved = menuItemRepository.save(item);
        return convertToDTO(saved);
    }

     @CacheEvict(value = "menu:all", allEntries = true)
    @Override
    public MenuItemDTO updateItem(Long id, MenuItem menuItem) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        existing.setName(menuItem.getName());
        existing.setDescription(menuItem.getDescription());
        existing.setPrice(menuItem.getPrice());
        existing.setCategory(menuItem.getCategory());
        existing.setImageUrl(menuItem.getImageUrl());
        existing.setAvailable(menuItem.isAvailable());
        MenuItem updated = menuItemRepository.save(existing);
        return convertToDTO(updated);
    }

    @CacheEvict(value = "menu:all", allEntries = true)
    @Override
    public void deleteItem(Long id) {
        menuItemRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Menu item not found")
        );
        menuItemRepository.deleteById(id);
    }

    private MenuItemDTO convertToDTO(MenuItem item) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setCategory(item.getCategory());
        dto.setImageUrl(item.getImageUrl());
        dto.setAvailable(item.isAvailable());
        return dto;
    }

}
