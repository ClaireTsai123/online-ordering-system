package com.ordering.common.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    private Long menuItemId;
    private String name;
    private BigDecimal price;
    private Integer quantity;
}
