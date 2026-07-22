FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy parent pom.xml and all modules
COPY pom.xml .
COPY common/pom.xml ./common/
COPY common/src ./common/src
COPY user-service/pom.xml ./user-service/
COPY user-service/src ./user-service/src

# Install Maven
RUN apk add --no-cache maven

# Build user-service and its dependencies (common)
RUN mvn clean package -pl user-service -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/user-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
