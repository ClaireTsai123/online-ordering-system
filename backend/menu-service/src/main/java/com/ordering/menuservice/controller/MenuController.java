package com.ordering.menuservice.controller;

import com.ordering.common.dto.ApiResponse;
import com.ordering.common.dto.MenuItemDTO;
import com.ordering.menuservice.entity.MenuItem;
import com.ordering.menuservice.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menu/items")
public class MenuController {
    private final MenuService menuService;

    @GetMapping
    //@Cacheable(value = "menu:all")
    public ApiResponse<List<MenuItemDTO>> getAllItems() {
        //System.out.println(">>> HITTING DB <<<");
        return ApiResponse.success(menuService.getAllAvailableItems());
    }

    @GetMapping("/{id}")
    public ApiResponse<MenuItemDTO> getItem(@PathVariable Long id) {
        return ApiResponse.success(menuService.getItemById(id));
    }

    @GetMapping("/category")//GET /api/menu/items/category?category=drink
    public ApiResponse<List<MenuItemDTO>> getItemsByCategory(@RequestParam("category") String category) {
        return ApiResponse.success(menuService.getMenuItemsByCategory(category));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ApiResponse<MenuItemDTO> createItem(@Valid @RequestBody MenuItem menuItem) {
        return ApiResponse.success(menuService.createItem(menuItem));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ApiResponse<MenuItemDTO> updateItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        return ApiResponse.success(menuService.updateItem(id, menuItem));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ApiResponse<Void> deleteItem(@PathVariable Long id) {
        menuService.deleteItem(id);
        return ApiResponse.success(null);
    }
}
