FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy parent pom.xml and all modules
COPY pom.xml .
COPY common/pom.xml ./common/
COPY common/src ./common/src
COPY cart-service/pom.xml ./cart-service/
COPY cart-service/src ./cart-service/src
COPY order-service/pom.xml ./order-service/
COPY order-service/src ./order-service/src

# Install Maven
RUN apk add --no-cache maven

# Build order-service and its dependencies (common, cart-service for Feign client)
RUN mvn clean package -pl order-service -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/order-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
