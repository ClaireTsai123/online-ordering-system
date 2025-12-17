package com.ordering.orderservice.service;

import com.ordering.common.domain.OrderStatus;
import com.ordering.orderservice.entity.Order;
import com.ordering.common.dto.OrderDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Order createOrder(Long userId);

    Order payOrder(Long orderId, Long userId);

    OrderDTO getOrderById(Long orderId, Long userId);
    Page<OrderDTO> getMyOrders(Long userId, Pageable pageable);

    Order cancelOrder(Long orderId, Long userId);

    Page<OrderDTO> getAllOrders(Pageable pageable);
    Page<OrderDTO> getOrdersByStatus(OrderStatus status, Pageable pageable);


}
