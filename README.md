# Online Ordering System

A full-stack, microservice-based online ordering system with a Spring Cloud backend and a React frontend.

---

## Project Structure

```
online-ordering-system/
├── backend/ # Spring Cloud microservices (Gateway, User, Menu, Cart, Order,OrderConsumer)
└── frontend/ # React + Vite + Tailwind frontend

```

---

## Backend
See: [`backend/README.md`](backend/README.md)

Key features:
- Spring Cloud Gateway + Eureka
- JWT authentication
- Redis cart
- RabbitMQ order events
- ShardingSphere for orders

---

## Frontend
See: [`frontend/README.md`](frontend/README.md)

Key features:
- React + TypeScript + Vite
- Role-based UI (Customer / Vendor / Admin)
- Cart & order workflow
- Tailwind CSS UI

---

## Roles

| Role     | Capabilities              |
|----------|---------------------------|
| CUSTOMER | Browse menu, cart, orders |
| VENDOR   | Manage menu               |
| ADMIN    | Manage users & menu       |

---

## How to Run

Backend and frontend are started separately.  
Refer to the respective README files for detailed instructions.
