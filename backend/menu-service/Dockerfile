FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy parent pom.xml and all modules
COPY pom.xml .
COPY common/pom.xml ./common/
COPY common/src ./common/src
COPY menu-service/pom.xml ./menu-service/
COPY menu-service/src ./menu-service/src

# Install Maven
RUN apk add --no-cache maven

# Build menu-service and its dependencies (common)
RUN mvn clean package -pl menu-service -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/menu-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
