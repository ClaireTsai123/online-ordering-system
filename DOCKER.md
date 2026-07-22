# Docker Setup Guide

This guide explains how to containerize and run all services using Docker and Docker Compose.

## Prerequisites

- **Docker** 20.10+ installed
- **Docker Compose** 2.0+ installed
- At least **4GB RAM** available for Docker
- At least **10GB** free disk space

---

## Quick Start

### Start All Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears databases)
docker-compose down -v
```

### Start Services in Stages

If you want to start services in stages to see the startup sequence:

```bash
# 1. Start infrastructure
docker-compose up -d mysql redis rabbitmq

# Wait for infrastructure to be ready (about 30 seconds)
sleep 30

# 2. Start Eureka
docker-compose up -d eureka-server

# Wait for Eureka to be ready
sleep 20

# 3. Start all other services
docker-compose up -d
```

---

## Service URLs

Once all services are running:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React application |
| API Gateway | http://localhost:8080 | Main API entry point |
| Eureka Dashboard | http://localhost:8761 | Service discovery |
| RabbitMQ Management | http://localhost:15672 | Message queue (guest/guest) |
| User Service | http://localhost:8081 | Direct access (bypass gateway) |
| Menu Service | http://localhost:8082 | Direct access |
| Cart Service | http://localhost:8083 | Direct access |
| Order Service | http://localhost:8084 | Direct access |
| Order Consumer Service | http://localhost:8085 | Direct access |

---

## Building Individual Services

### Build a Single Service

```bash
# Build eureka-server
docker-compose build eureka-server

# Build frontend
docker-compose build frontend

# Build all services
docker-compose build
```

### Build Without Cache

```bash
docker-compose build --no-cache
```

---

## Viewing Logs

### All Services

```bash
docker-compose logs -f
```

### Specific Service

```bash
# User service logs
docker-compose logs -f user-service

# API Gateway logs
docker-compose logs -f api-gateway

# Frontend logs
docker-compose logs -f frontend
```

### Last 100 Lines

```bash
docker-compose logs --tail=100 -f
```

---

## Health Checks

All services include health checks. Check service status:

```bash
# Check all services
docker-compose ps

# Check specific service health
docker inspect ordering-user-service | grep -A 10 Health
```

---

## Database Access

### MySQL

```bash
# Connect to MySQL
docker exec -it ordering-mysql mysql -uroot -proot1234

# List databases
docker exec -it ordering-mysql mysql -uroot -proot1234 -e "SHOW DATABASES;"

# Access specific database
docker exec -it ordering-mysql mysql -uroot -proot1234 user_db
```

### Redis

```bash
# Connect to Redis CLI
docker exec -it ordering-redis redis-cli

# Test connection
docker exec -it ordering-redis redis-cli ping
```

---

## Troubleshooting

### Services Not Starting

1. **Check logs:**
   ```bash
   docker-compose logs <service-name>
   ```

2. **Check if ports are already in use:**
   ```bash
   # macOS/Linux
   lsof -i :8080
   lsof -i :3306
   
   # Or use netstat
   netstat -an | grep LISTEN
   ```

3. **Verify Docker resources:**
   ```bash
   docker stats
   ```

### Services Not Registering with Eureka

1. **Check Eureka dashboard:** http://localhost:8761
2. **Verify network connectivity:**
   ```bash
   docker network inspect online-ordering-system_ordering-network
   ```
3. **Check service logs for connection errors**

### Database Connection Issues

1. **Wait for MySQL to be fully ready:**
   ```bash
   docker-compose logs mysql | grep "ready for connections"
   ```

2. **Verify MySQL is accessible:**
   ```bash
   docker exec -it ordering-mysql mysql -uroot -proot1234 -e "SELECT 1;"
   ```

### Frontend Cannot Connect to Backend

1. **Check API Gateway is running:**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. **Verify environment variable:**
   The frontend container uses `VITE_API_BASE_URL=http://localhost:8080`
   
   If accessing from a different machine, update the docker-compose.yml:
   ```yaml
   frontend:
     environment:
       - VITE_API_BASE_URL=http://<your-host-ip>:8080
   ```

### Out of Memory

If services fail due to memory issues:

1. **Increase Docker memory limit** (Docker Desktop → Settings → Resources)
2. **Start services in smaller batches**
3. **Remove unused containers:**
   ```bash
   docker system prune -a
   ```

---

## Development Workflow

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker-compose build <service-name>
docker-compose up -d <service-name>

# Rebuild all
docker-compose build
docker-compose up -d
```

### Hot Reload (Development)

For development, you may want to mount source code:

```yaml
# Add to docker-compose.yml service (example for user-service)
volumes:
  - ./backend/user-service/src:/app/src
```

Then use Spring Boot DevTools for hot reload.

---

## Production Considerations

### Environment Variables

Create a `.env` file for production:

```env
MYSQL_ROOT_PASSWORD=your_secure_password
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=your_secure_password
```

### Resource Limits

Add resource limits to docker-compose.yml:

```yaml
services:
  user-service:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Persistent Volumes

Data is persisted in Docker volumes:
- `mysql_data` - MySQL data
- Redis data is ephemeral (consider adding volume for persistence)

### Security

1. **Change default passwords** in production
2. **Use secrets management** (Docker secrets, Vault, etc.)
3. **Enable SSL/TLS** for database connections
4. **Restrict network access** using Docker networks
5. **Use non-root users** in containers (update Dockerfiles)

---

## Clean Up

### Stop and Remove Containers

```bash
docker-compose down
```

### Remove Containers and Volumes

```bash
# WARNING: This deletes all database data
docker-compose down -v
```

### Remove Images

```bash
# Remove all project images
docker-compose down --rmi all

# Remove specific image
docker rmi online-ordering-system_eureka-server
```

### Complete Cleanup

```bash
# Remove everything (containers, volumes, images)
docker-compose down -v --rmi all

# Clean up unused Docker resources
docker system prune -a
```

---

## Dockerfile Structure

Each service has its own Dockerfile:

- **Backend services:** Multi-stage build (Maven build → JRE runtime)
- **Frontend:** Multi-stage build (Node build → Nginx serve)

### Building Manually

```bash
# Backend service (from project root)
cd backend
docker build -f eureka-server/Dockerfile -t eureka-server:latest .

# Frontend
cd online-ordering-frontend
docker build -t frontend:latest .
```

---

## Network Architecture

All services run on a single Docker network: `ordering-network`

- Services communicate using service names (e.g., `mysql`, `redis`, `eureka-server`)
- Ports are exposed to host for external access
- Internal communication uses Docker DNS

---

## Monitoring

### Container Stats

```bash
docker stats
```

### Service Health

```bash
# Check all services
docker-compose ps

# Check specific service
docker inspect <container-name> | grep Health -A 10
```

### Log Aggregation

For production, consider:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Prometheus + Grafana**
- **Loki + Grafana**

---

## Next Steps

1. **Set up CI/CD** to build and push images
2. **Use Docker Swarm or Kubernetes** for orchestration
3. **Add monitoring and alerting**
4. **Implement log aggregation**
5. **Set up backup strategies** for databases

