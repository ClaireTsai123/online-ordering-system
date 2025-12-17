package com.ordering.orderconsumerservice.listener;

import com.ordering.common.domain.OrderStatus;
import com.ordering.orderconsumerservice.config.RabbitMQConfig;
import com.ordering.orderconsumerservice.repository.OrderRepository;
import com.ordering.common.event.OrderPaidEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderPaidListener {
    private  final OrderRepository orderRepository;

    @RabbitListener(queues = RabbitMQConfig.ORDER_PAID_QUEUE)
    public void handleOrderPaid(OrderPaidEvent event) {
        System.out.println("Order paid event received: " + event.getOrderId());
        orderRepository.findById(event.getOrderId())
                .ifPresent(order -> {
                    if (order.getStatus() == OrderStatus.COMPLETED){
                        return;
                    }
                    order.setStatus(OrderStatus.COMPLETED);
                    orderRepository.save(order);
                });
    }
}
