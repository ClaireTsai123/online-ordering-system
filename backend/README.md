# Online Ordering System

## Project Overview

The Online Ordering System is a distributed microservices-based backend application designed to support user registration, menu browsing, shopping cart management, order creation, payment simulation, and asynchronous order processing.

The system is built using **Spring Cloud** and follows modern microservice best practices, including service discovery, API gateway routing, distributed caching, message-driven architecture, and database sharding.

---

## System Architecture

The system is composed of multiple independent microservices communicating through REST APIs and message queues.

### Core Components

- **API Gateway** – Central entry point for all client requests
- **Service Discovery (Eureka)** – Dynamic service registration and lookup
- **User Service** – Authentication, authorization, and user management
- **Menu Service** – Menu management with Redis caching
- **Cart Service** – Shopping cart management using Redis
- **Order Service** – Order creation, payment, and order queries
- **Order Consumer Service** – Asynchronous order status processing
- **Common** – Common DTOs, exceptions, security utilities
- **Message Queue (RabbitMQ)** – Asynchronous order event handling
- **Databases (MySQL + ShardingSphere)** – Persistent storage with sharding

---

## Technology Stack

### Backend

- **Java 17**
- **Spring Boot**
- **Spring Cloud** (Gateway, Eureka, OpenFeign)
- **Spring Security + JWT**
- **Spring Data JPA**
- **Spring Cache**
- **Redis**
- **RabbitMQ**
- **MySQL**
- **Apache ShardingSphere**

### Infrastructure

- Microservice architecture
- RESTful APIs
- Asynchronous messaging
- Distributed caching
- Database sharding

---

## Microservices Overview

### 1. API Gateway

- Single entry point for all APIs
- Routes requests to backend services
- Propagates authentication headers
- Integrates with service discovery

### 2. User Service

- User registration and login
- JWT token generation and validation
- Role-based authorization
- **Roles supported:**
    - `ROLE_CUSTOMER`
    - `ROLE_VENDOR`
    - `ROLE_ADMIN`

### 3. Menu Service

- Menu item CRUD operations
- Role-based access (Vendor/Admin)
- Redis caching for menu list queries
- Cache invalidation on menu updates

### 4. Cart Service

- Shopping cart stored in Redis
- Add, remove, update cart items
- Cart TTL (auto-expiration)
- Feign client integration with Menu Service for item validation

### 5. Order Service

- Create orders from cart data
- Order payment simulation
- Order cancellation
- Query orders by user or admin
- Publishes order events to message queue
- Feign client integration with Cart Service for cart validation
- Uses MySQL with database sharding

### 6. Order Consumer Service

- Consumes order events from RabbitMQ
- Updates order status asynchronously
- Ensures idempotent processing

### 7. Shared Library

- Unified `ApiResponse` format
- Common DTOs
- Global exception handling
- Feign error decoder
- JWT utility classes
- Shared security filters

---

## Authentication & Authorization

- **JWT-based authentication**
- Tokens passed via `Authorization: Bearer <token>`
- Role-based access control enforced at service level
- Secure inter-service communication via propagated headers

---

## Data Storage Strategy

### Redis

- Shopping cart data
- Menu caching
- TTL-based expiration for carts

### MySQL

- Persistent storage for users, menu, orders
- Order data is sharded across multiple databases using ShardingSphere

### Database Sharding

- Implemented using **Apache ShardingSphere**
- Orders distributed across multiple databases (e.g., `order_db_0`, `order_db_1`)
- **Sharding key:** `order_id`
- Improves scalability and write performance

---

## Asynchronous Processing

- **RabbitMQ** used for order events
- Order creation publishes events
- Order Consumer Service processes events asynchronously
- Decouples order creation from post-processing logic

---

## Error Handling

- Unified error response format across all services
- Centralized global exception handling
- **Feign error handling covers:**
    - HTTP errors
    - Network failures
    - Downstream service unavailability
- Consistent error responses returned to clients

---

## Key Features Summary

- Microservice architecture with Spring Cloud
- JWT-based authentication and authorization
- Role-based access control
- Redis caching and TTL management
- Asynchronous message-driven processing
- Database sharding for scalability
- Unified API response and error handling
- Clean service separation and extensibility

---

## How to Run (Local)

1. **Start Redis**
2. **Start RabbitMQ**
3. **Start MySQL**
4. **Start Eureka Server**
5. **Start API Gateway**
6. **Start backend services** in any order:
    - `user-service`
    - `menu-service`
    - `cart-service`
    - `order-service`
    - `order-consumer-service`

---

## API Endpoints

### Auth Service / User Service

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/users` - Get all users(Admin)
- `GET /api/users/{id}` - Get user by id(Admin)
- `PUT /api/users` - update user by id(Admin)
- `DELETE /api/users/{id}` - delete user by id(Admin)

### Menu Service

- `GET /api/menu/items` - Get all menu items (cached)
- `POST /api/menu/items` - Create menu item (Vendor/Admin)
- `PUT /api/menu/items/{id}` - Update menu item (Vendor/Admin)
- `DELETE /api/menu/items/{id}` - Delete menu item (Vendor/Admin)

### Cart Service

- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{itemId}` - Update cart item quantity
- `DELETE /api/cart/items/{itemId}` - Remove item from cart
- `DELETE /api/cart/clear` - clear items from cart
- `GET /api/cart` - Get current cart

### Order Service

- `POST /api/orders` - Create order from cart
- `POST /api/orders/{orderId}/pay` - Simulate payment
- `POST /api/orders/{orderId}/cancel` - Cancel order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{orderId}` - Get order details
- `GET /api/orders/my` - Get my order details

---

## Future Enhancements

- Add comprehensive unit and integration tests
- Implement distributed tracing (e.g., Zipkin)
- Add monitoring and alerting (e.g., Prometheus, Grafana)
- Implement rate limiting and throttling
- Add CI/CD pipeline
- Container orchestration with Kubernetes
- Implement saga pattern for distributed transactions

---
