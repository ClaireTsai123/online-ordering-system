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
See: [`frontend/README.md`](online-ordering-frontend/README.md)

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

### Option 1: Docker (Recommended)

**🐳 [Docker Setup Guide →](DOCKER.md)**

Quick start:
```bash
docker-compose up -d
```

All services will be automatically started with proper dependencies and networking. See [`DOCKER.md`](DOCKER.md) for detailed instructions.

### Option 2: Local Development

**📖 [Complete Startup Guide →](START_SERVICES.md)**

For detailed step-by-step instructions to start all services locally (infrastructure, backend, and frontend), see [`START_SERVICES.md`](START_SERVICES.md).

Quick overview:
- Backend and frontend are started separately
- Services must be started in a specific order (Eureka → Gateway → Services)
- Requires MySQL, Redis, and RabbitMQ to be running
