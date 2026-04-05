# ── Build stage ──────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build the fat JAR, skipping tests for faster builds
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy only the executable JAR from the build stage
COPY --from=build /app/target/shopkart-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
