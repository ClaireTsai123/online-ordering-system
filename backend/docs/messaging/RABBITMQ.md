# Messaging (RabbitMQ)

## Purpose

The Online Ordering System uses asynchronous messaging to decouple order creation from order status updates. This improves scalability, reliability, and responsiveness.

---

## Technology

- **RabbitMQ**
- **Spring AMQP**
- **JSON message payloads**

---

## Roles

- **Producer:** Order Service
- **Consumer:** Order Consumer Service

---

## Message Flow

1. User creates or pays for an order
2. Order Service saves the order and publishes an event
3. RabbitMQ stores the event in a queue
4. Order Consumer Service consumes the event and updates order status asynchronously

---

## Event Example

```json
{
  "orderId": 1765767363025261,
  "status": "PAID"
}
```

---

## Benefits

- **Loose coupling** between services
- **Non-blocking** order processing
- **Fault tolerance** (messages persist if consumer is down)
- **Scalable** and production-ready design

---

## Summary

RabbitMQ enables asynchronous order processing in the system, ensuring that order creation remains fast and reliable while background tasks are handled independently.