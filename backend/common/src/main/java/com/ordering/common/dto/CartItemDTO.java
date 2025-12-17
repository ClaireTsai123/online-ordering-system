package com.ordering.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private Long menuItemId;
    private String name;
    private BigDecimal price;
    private Integer quantity;

}
