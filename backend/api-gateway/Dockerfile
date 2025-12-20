FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy parent pom.xml and all modules
COPY pom.xml .
COPY common/pom.xml ./common/
COPY common/src ./common/src
COPY api-gateway/pom.xml ./api-gateway/
COPY api-gateway/src ./api-gateway/src

# Install Maven
RUN apk add --no-cache maven

# Build api-gateway and its dependencies (common)
RUN mvn clean package -pl api-gateway -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
