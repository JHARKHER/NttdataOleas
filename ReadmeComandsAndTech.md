Proyecto Ntt_Data
=================
1️⃣ Información del Proyecto

2 microservicios

Comunicación asíncrona (Kafka, MQ, etc.)

WebFlux: reactivo porque maneja muchos hilos y es escalable

JPA se encarga de la persistencia de mappear los objetos a entidades de la base de datos.

Arquitectura limpia

Logs: CustomerController o MovementService

Lombok: menos código repetitivo

Manejo global de excepciones

F1 → F7

Docker

Pruebas unitarias e integración

API First

Arquitectura separada por capas

Kafka: CustomerKafkaConsumer

Integración: 
Test de Integración: WebTestClient te permite simular peticiones HTTP a los endpoints, se usa dentro del archivo de pruebas para hacer las solicitudes y validar las respuestas

## 2️⃣ Microservicios

Microservicio 1: ms-customer
Responsabilidad:
Persona
Cliente
CRUD
Publicar evento Kafka cuando se crea cliente
Microservicio 2: ms-account
Responsabilidad:
Cuenta
Movimientos
Reportes
Consumir evento Kafka

## 3️⃣ Comandos usados

**Levantar infraestructura**
docker-compose up -d

**Ver contenedores:**
docker ps

**Borrar topic Kafka**
docker exec -it kafka bash

**Borrar topic:**
/opt/kafka/bin/kafka-topics.sh \
--bootstrap-server localhost:9092 \
--delete \
--topic customer-events

**Crear topic:**
/opt/kafka/bin/kafka-topics.sh \
--bootstrap-server localhost:9092 \
--create \
--topic customer-events \
--partitions 1 \
--replication-factor 1

**Compilar microservicios**
mvn clean
mvn spring-boot:run

## 4️⃣ QUÉ HACE EL CÓDIGO (EXPLICACIÓN TÉCNICA)

## 📌 ms-customer

🔹 Entidad Person

@MappedSuperclass
→ Permite herencia JPA.

🔹 Entidad Customer

@Entity
@EqualsAndHashCode(callSuper = true)
→ Hereda campos de Person.

Cumple requisito:
Cliente debe heredar de Persona.

🔹 CustomerController
@PostMapping

public Mono<Customer> create(...)

Uso de:
WebFlux (Mono / Flux)
Inyección por constructor
Logging
Arquitectura limpia (controller → service → repository)

🔹 Kafka Producer
Antes enviabas entidad JPA (error arquitectónico).
Ahora envías:

CustomerCreatedEvent
Eso es correcto para microservicios.

## 📌 ms-account
🔹 MovementService
Aquí implementaste F2 y F3:

BigDecimal amount = type.equalsIgnoreCase("Retiro") ? value.negate() : value;

Y:

if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
return Mono.error(new InsufficientBalanceException("Saldo no disponible"));
}

Cumple exactamente:

F3: “Saldo no disponible”

Se maneja con excepción personalizada.
Eso es arquitectura limpia.

🔹 ReportController

Cumple F4:

/reports/{clientId}?startDate=...&endDate=...

### 5️⃣ COMUNICACIÓN ASÍNCRONA (LO MÁS IMPORTANTE)

Cuando se crea un cliente:

ms-customer:

POST /api/v1/customers

→ Guarda en DB
→ Publica evento Kafka
→ Topic: customer-events

ms-account:

@KafkaListener(...)

→ Recibe evento
→ Ejecuta lógica adicional

Eso cumple perfil Senior.

## 6️⃣ PRUEBAS

Se tiene:
Unit Test
MovementServiceTest

Valida:
Que lance "Saldo no disponible"

Cumple F5.

Integration Test

AccountIntegrationTest

Cumple F6.

## 7️⃣ DOCKER

docker-compose incluye:

postgres

kafka

ms-customer

ms-account

Cumple F7.

## 8️⃣ BUENAS PRÁCTICAS APLICADAS

✔ Constructor Injection
✔ Lombok
✔ Logging (Slf4j)
✔ Arquitectura por capas
✔ Manejo global de excepciones
✔ Eventos en vez de compartir entidades
✔ WebFlux
✔ JPA
✔ Separación de dominios
