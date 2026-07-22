# How to Start All Services

This guide provides step-by-step instructions to start all services in the Online Ordering System.

## Prerequisites

Before starting, ensure you have the following installed:

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm**
- **MySQL 8.0+**
- **Redis**
- **RabbitMQ**

---

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Eureka Server | 8761 | Service discovery |
| API Gateway | 8080 | Main entry point |
| User Service | 8081 | Authentication & user management |
| Menu Service | 8082 | Menu management |
| Cart Service | 8083 | Shopping cart |
| Order Service | 8084 | Order processing |
| Order Consumer Service | 8085 | Async order processing |
| Frontend | 5173 (default Vite) | React application |

---

## Step 1: Start Infrastructure Services

### 1.1 Start MySQL

```bash
# macOS (using Homebrew)
brew services start mysql

# Linux
sudo systemctl start mysql

# Or using Docker
docker run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=root1234 \
  -e MYSQL_ROOT_HOST=% \
  -p 3306:3306 \
  mysql:8.0
```

**Note:** The services expect MySQL with:
- Username: `root`
- Password: `root1234`
- Port: `3306`

The services will automatically create the required databases:
- `user_db`
- `menu_db`
- `order_db_0` and `order_db_1` (for sharding)

### 1.2 Start Redis

```bash
# macOS (using Homebrew)
brew services start redis

# Linux
sudo systemctl start redis

# Or using Docker
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:latest
```

**Note:** Redis should be running on `localhost:6379`

### 1.3 Start RabbitMQ

```bash
# macOS (using Homebrew)
brew services start rabbitmq

# Linux
sudo systemctl start rabbitmq-server

# Or using Docker
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=guest \
  -e RABBITMQ_DEFAULT_PASS=guest \
  rabbitmq:3-management
```

**Note:** RabbitMQ should be running on:
- AMQP: `localhost:5672`
- Management UI: `http://localhost:15672` (guest/guest)

---

## Step 2: Start Backend Services

### 2.1 Build the Project

Navigate to the backend directory and build all services:

```bash
cd backend
mvn clean install
```

This will compile all microservices and their dependencies.

### 2.2 Start Services in Order

Services should be started in the following order:

#### 2.2.1 Start Eureka Server (Service Discovery)

```bash
cd eureka-server
mvn spring-boot:run
```

**Verify:** Open http://localhost:8761 in your browser. You should see the Eureka dashboard.

#### 2.2.2 Start API Gateway

Open a **new terminal** and run:

```bash
cd backend/api-gateway
mvn spring-boot:run
```

**Verify:** The gateway should register with Eureka and be available on port 8080.

#### 2.2.3 Start User Service

Open a **new terminal** and run:

```bash
cd backend/user-service
mvn spring-boot:run
```

**Verify:** Check Eureka dashboard (http://localhost:8761) - `user-service` should appear.

#### 2.2.4 Start Menu Service

Open a **new terminal** and run:

```bash
cd backend/menu-service
mvn spring-boot:run
```

**Verify:** Check Eureka dashboard - `menu-service` should appear.

#### 2.2.5 Start Cart Service

Open a **new terminal** and run:

```bash
cd backend/cart-service
mvn spring-boot:run
```

**Verify:** Check Eureka dashboard - `cart-service` should appear.

#### 2.2.6 Start Order Service

Open a **new terminal** and run:

```bash
cd backend/order-service
mvn spring-boot:run
```

**Verify:** Check Eureka dashboard - `order-service` should appear.

#### 2.2.7 Start Order Consumer Service

Open a **new terminal** and run:

```bash
cd backend/order-consumer-service
mvn spring-boot:run
```

**Verify:** Check Eureka dashboard - `order-consumer-service` should appear.

---

## Step 3: Start Frontend

### 3.1 Install Dependencies

```bash
cd online-ordering-frontend
npm install
```

### 3.2 Set Environment Variable

Create a `.env` file in the `online-ordering-frontend` directory:

```bash
echo "VITE_API_BASE_URL=http://localhost:8080" > .env
```

Or manually create `.env` with:

```
VITE_API_BASE_URL=http://localhost:8080
```

### 3.3 Start Frontend Development Server

```bash
npm run dev
```

**Verify:** The frontend should be available at http://localhost:5173 (or the port shown in the terminal).

---

## Quick Start Script (Alternative)

You can also use Maven to start all backend services from the root:

```bash
# From backend directory
cd backend

# Start Eureka Server
mvn spring-boot:run -pl eureka-server &

# Wait a few seconds, then start other services
sleep 5
mvn spring-boot:run -pl api-gateway &
mvn spring-boot:run -pl user-service &
mvn spring-boot:run -pl menu-service &
mvn spring-boot:run -pl cart-service &
mvn spring-boot:run -pl order-service &
mvn spring-boot:run -pl order-consumer-service &
```

**Note:** This runs services in the background. Use `jobs` to see running processes and `fg %<job-number>` to bring one to foreground.

---

## Verification Checklist

After starting all services, verify:

- [ ] **Eureka Dashboard** (http://localhost:8761) shows all 6 services registered:
  - `api-gateway`
  - `user-service`
  - `menu-service`
  - `cart-service`
  - `order-service`
  - `order-consumer-service`

- [ ] **API Gateway** responds at http://localhost:8080

- [ ] **Frontend** loads at http://localhost:5173

- [ ] **RabbitMQ Management** accessible at http://localhost:15672 (guest/guest)

---

## Using Docker Compose (Optional)

If you prefer using Docker for infrastructure, create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root1234
      MYSQL_ROOT_HOST: '%'
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:latest
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest

volumes:
  mysql_data:
```

Then run:

```bash
docker-compose up -d
```

---

## Troubleshooting

### Services Not Registering with Eureka

- Ensure Eureka Server is running first
- Check that services can reach `http://localhost:8761`
- Verify network connectivity

### Database Connection Issues

- Ensure MySQL is running and accessible
- Verify credentials: `root` / `root1234`
- Check that databases are being created (services use `createDatabaseIfNotExist=true`)

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping` (should return `PONG`)
- Check port 6379 is not blocked

### RabbitMQ Connection Issues

- Verify RabbitMQ is running: `rabbitmqctl status`
- Check ports 5672 and 15672 are accessible
- Default credentials: `guest` / `guest`

### Frontend Cannot Connect to Backend

- Verify `VITE_API_BASE_URL` is set to `http://localhost:8080`
- Ensure API Gateway is running
- Check browser console for CORS errors

### Port Already in Use

If a port is already in use, either:
- Stop the service using that port
- Change the port in the service's `application.yml`

---

## Stopping Services

### Stop Backend Services

Press `Ctrl+C` in each terminal where a service is running.

Or if using background processes:

```bash
# Find Java processes
jps -l

# Kill specific service (replace PID)
kill <PID>
```

### Stop Infrastructure Services

```bash
# MySQL
brew services stop mysql
# or
docker stop mysql

# Redis
brew services stop redis
# or
docker stop redis

# RabbitMQ
brew services stop rabbitmq
# or
docker stop rabbitmq
```

### Stop Frontend

Press `Ctrl+C` in the terminal running the frontend.

---

## Next Steps

Once all services are running:

1. **Register a user** via the frontend or API
2. **Login** to get a JWT token
3. **Browse menu** items
4. **Add items** to cart
5. **Create an order**
6. **Process payment**

For API documentation, see [`backend/docs/api/API_DOCUMENTATION.md`](backend/docs/api/API_DOCUMENTATION.md)

