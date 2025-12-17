package com.ordering.menuservice.service;

import com.ordering.common.dto.MenuItemDTO;
import com.ordering.menuservice.entity.MenuItem;

import java.util.List;

public interface MenuService {

    List<MenuItemDTO> getAllAvailableItems();

    MenuItemDTO getItemById(Long id);

    MenuItemDTO createItem(MenuItem item);

    MenuItemDTO updateItem(Long id, MenuItem item);

    void deleteItem(Long id);

    List<MenuItemDTO> getMenuItemsByCategory(String category);
}
