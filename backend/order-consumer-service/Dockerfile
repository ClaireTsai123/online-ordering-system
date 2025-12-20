FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy parent pom.xml and all modules
COPY pom.xml .
COPY common/pom.xml ./common/
COPY common/src ./common/src
COPY order-consumer-service/pom.xml ./order-consumer-service/
COPY order-consumer-service/src ./order-consumer-service/src

# Install Maven
RUN apk add --no-cache maven

# Build order-consumer-service and its dependencies (common)
RUN mvn clean package -pl order-consumer-service -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/order-consumer-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]

