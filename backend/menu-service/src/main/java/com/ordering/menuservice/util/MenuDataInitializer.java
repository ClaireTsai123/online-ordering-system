package com.ordering.menuservice.util;

import com.ordering.menuservice.entity.MenuItem;
import com.ordering.menuservice.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MenuDataInitializer implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) {
        // Avoid duplicate inserts on restart
        if (menuItemRepository.count() > 0) {
            return;
        }

        List<MenuItem> items = List.of(
                new MenuItem(null, "Cheeseburger",
                        "Beef patty with cheese",
                        new BigDecimal("8.99"),
                        "FOOD",
                        "https://example.com/burger.jpg",
                        true, null, null),


                new MenuItem(null, "French Fries",
                        "Crispy fries",
                        new BigDecimal("3.49"),
                        "FOOD",
                        "https://example.com/fries.jpg",
                        true, null, null),

                new MenuItem(null, "Coca Cola",
                        "Cold drink",
                        new BigDecimal("1.99"),
                        "DRINK",
                        "https://example.com/coke.jpg",
                        true, null, null),

                new MenuItem(null, "Ice Cream",
                        "Vanilla ice cream",
                        new BigDecimal("2.99"),
                        "DESSERT",
                        "https://example.com/icecream.jpg",
                        true, null, null)
        );

        menuItemRepository.saveAll(items);

        System.out.println("Sample menu items initialized");
    }
}

