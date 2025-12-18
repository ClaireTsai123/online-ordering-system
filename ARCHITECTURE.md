# System Architecture

This document describes the high-level architecture of the **Online Ordering System**. Detailed API definitions, sharding strategy, and messaging design are documented separately.

---

## 1. Architecture Overview

Microservice-based architecture using **Spring Cloud** and **React**, with JWT authentication and event-driven communication.
```mermaid
graph TB
    subgraph Client
        FE[React Frontend<br/>:5174]
    end
    
    subgraph Infrastructure
        GW[API Gateway<br/>:8080]
        EUR[Eureka Server<br/>:8761]
        RMQ[RabbitMQ]
        REDIS[(Redis)]
    end
    
    subgraph Microservices
        US[User Service<br/>:8081]
        MS[Menu Service<br/>:8082]
        CS[Cart Service<br/>:8083]
        OS[Order Service<br/>:8084]
        OCS[Order Consumer<br/>:8085]
    end
    
    subgraph Databases
        USDB[(MySQLUser_db)]
        MSDB[(MySQLMenu_db)]
        OSDB[(MySQL + ShardingSphereorder_db)]
    end
    
    FE -->|REST/JWT| GW
    GW -.->|Discovery| EUR
    GW --> US & MS & CS & OS
    
    US & MS & CS & OS & OCS -.->|Register| EUR
    
    US --> USDB
    MS --> MSDB
    CS --> REDIS
    OS --> OSDB
    OS -->|Publish Events| RMQ
    RMQ -->|Consume Events| OCS
    OCS --> OSDB
    
    style FE fill:#e1f5ff
    style GW fill:#fff4e1
    style EUR fill:#fff4e1
    style RMQ fill:#ffe1f5
    style REDIS fill:#ffe1f5
    
```

---

## 2. System Components

| Component          | Port | Responsibility                                      |
|--------------------|------|-----------------------------------------------------|
| **React Frontend** | 5174 | Role-based UI (Customer/Vendor/Admin)               |
| **API Gateway**    | 8080 | Routing, JWT validation                             |
| **Eureka Server**  | 8761 | Service discovery and registration                  |
| **User Service**   | 8081 | Authentication, user management (MySQL)             |
| **Menu Service**   | 8082 | Menu and product catalog (MySQL)                    |
| **Cart Service**   | 8083 | Shopping cart management (Redis)                    |
| **Order Service**  | 8084 | Order creation and queries (MySQL + ShardingSphere) |
| **Order Consumer** | 8085 | Async order processing (MySQL + ShardingSphere)     |
| **RabbitMQ**       | -    | Event-driven messaging                              |
| **Redis**          | -    | Caching and cart storage                            |

---

## 3. Core Data Flows

### 3.1 Authentication Flow
```mermaid
sequenceDiagram
    Client->>Gateway: Login (credentials)
    Gateway->>UserService: Validate
    UserService-->>Gateway: JWT token
    Gateway-->>Client: JWT token
    Client->>Gateway: Request + JWT
    Gateway->>Gateway: Validate JWT
    Gateway->>Service: Forward request
```

### 3.2 Order Processing Flow
```mermaid
sequenceDiagram
    Client->>Gateway: Create order
    Gateway->>OrderService: Process
    OrderService->>MySQL: Insert 
    OrderService->>RabbitMQ: OrderCreated event
    OrderService-->>Client: Confirmation
    RabbitMQ->>OrderConsumer: Event
    OrderConsumer->>MySQL: Update status
```

---

## 4. Communication Patterns

- **Client ↔ Backend**: REST via API Gateway
- **Service Discovery**: Eureka-based registration
- **Sync**: REST 
- **Async**: RabbitMQ events

---

## 5. Design Highlights

- **Scalability**: Stateless services, horizontal scaling
- **Security**: JWT authentication, role-based authorization
- **Performance**: Redis caching, async processing, database sharding
- **Isolation**: Independent services, no shared databases

---

## 6. Related Documents

- [`README.md`](README.md) – Project overview
- [`API_DOCUMENTATION.md`](backend/docs/api/API_DOCUMENTATION.md) – API definitions
- [`MYSQL_SHARDING.md`](backend/docs/database/MYSQL_SHARDING.md) – Database sharding
- [`REDIS.md`](backend/docs/database/REDIS.md) – Database sharding
- [`RABBITMQ.md`](backend/docs/messaging/RABBITMQ.md) – Messaging design