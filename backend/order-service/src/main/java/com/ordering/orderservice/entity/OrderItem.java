package com.ordering.orderservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "order_items")
public class OrderItem {
    @Id
    private Long id;

    private Long orderId;
    private Long menuItemId;
    private String name;
    private BigDecimal price;
    private Integer quantity;

}
