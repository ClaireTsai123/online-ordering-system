FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy parent pom.xml and all modules
COPY pom.xml .
COPY common/pom.xml ./common/
COPY common/src ./common/src
COPY menu-service/pom.xml ./menu-service/
COPY menu-service/src ./menu-service/src
COPY cart-service/pom.xml ./cart-service/
COPY cart-service/src ./cart-service/src

# Install Maven
RUN apk add --no-cache maven

# Build cart-service and its dependencies (common, menu-service for Feign client)
RUN mvn clean package -pl cart-service -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/cart-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
