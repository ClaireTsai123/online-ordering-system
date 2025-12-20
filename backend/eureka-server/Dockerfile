FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy parent pom.xml and all modules
COPY pom.xml .
COPY common/pom.xml ./common/
COPY eureka-server/pom.xml ./eureka-server/
COPY eureka-server/src ./eureka-server/src

# Install Maven
RUN apk add --no-cache maven

# Build only eureka-server and its dependencies
RUN mvn clean package -pl eureka-server -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/eureka-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
