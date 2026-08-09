FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY backend/mvnw backend/pom.xml ./
COPY backend/.mvn ./.mvn
RUN chmod +x mvnw && ./mvnw -q -o dependency:go-offline || true
COPY backend/src ./src
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/cvfacil-ng-backend-1.0.0.jar app.jar
EXPOSE 7777
ENTRYPOINT ["java", "-jar", "app.jar"]
