
import { JavaProject } from '../types';

export const JAVA_PROJECT_DATA: JavaProject[] = [
  {
    name: "ms-customer",
    description: "Gestión de Clientes y Personas (F1). Microservicio reactivo con herencia de entidades y Kafka.",
    files: [
      {
        name: "CustomerApplication.java",
        path: "src/main/java/com/nttdata/customer/CustomerApplication.java",
        language: "java",
        content: `package com.nttdata.customer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CustomerApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomerApplication.class, args);
    }
}`
      },
      {
        name: "Person.java",
        path: "src/main/java/com/nttdata/customer/domain/entity/Person.java",
        language: "java",
        content: `package com.nttdata.customer.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@MappedSuperclass
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String gender;
    private String identification;
    private String address;
    private String phone;
}`
      },
      {
        name: "Customer.java",
        path: "src/main/java/com/nttdata/customer/domain/entity/Customer.java",
        language: "java",
        content: `package com.nttdata.customer.domain.entity;

import jakarta.persistence.Entity;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Customer extends Person {
    private String password;
    private Boolean state;
}`
      },
      {
        name: "CustomerController.java",
        path: "src/main/java/com/nttdata/customer/infra/api/CustomerController.java",
        language: "java",
        content: `package com.nttdata.customer.infra.api;

import com.nttdata.customer.domain.entity.Customer;
import com.nttdata.customer.domain.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService service;

    @PostMapping
    public Mono<Customer> create(@RequestBody Customer customer) {
        log.info("Creating customer: {}", customer.getName());
        return service.save(customer);
    }

    @GetMapping
    public Flux<Customer> getAll() {
        return service.findAll();
    }
}`
      },
      {
        name: "CustomerKafkaProducer.java",
        path: "src/main/java/com/nttdata/customer/infra/kafka/CustomerKafkaProducer.java",
        language: "java",
        content: `package com.nttdata.customer.infra.kafka;

import com.nttdata.customer.domain.entity.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomerKafkaProducer {
    private final KafkaTemplate<String, Customer> kafkaTemplate;
    private static final String TOPIC = "customer-events";

    public void sendCustomerCreatedEvent(Customer customer) {
        kafkaTemplate.send(TOPIC, customer);
    }
}`
      },
      {
        name: "GlobalExceptionHandler.java",
        path: "src/main/java/com/nttdata/customer/infra/api/advice/GlobalExceptionHandler.java",
        language: "java",
        content: `package com.nttdata.customer.infra.api.advice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }
}`
      }
    ]
  },
  {
    name: "ms-account",
    description: "Cuentas y Movimientos (F2-F4). Lógica de saldos, reportes y consumidor de eventos Kafka.",
    files: [
      {
        name: "AccountApplication.java",
        path: "src/main/java/com/nttdata/account/AccountApplication.java",
        language: "java",
        content: `package com.nttdata.account;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AccountApplication {
    public static void main(String[] args) {
        SpringApplication.run(AccountApplication.class, args);
    }
}`
      },
      {
        name: "MovementController.java",
        path: "src/main/java/com/nttdata/account/infra/api/MovementController.java",
        language: "java",
        content: `package com.nttdata.account.infra.api;

import com.nttdata.account.domain.entity.Movement;
import com.nttdata.account.domain.service.MovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/movements")
@RequiredArgsConstructor
public class MovementController {
    private final MovementService service;

    @PostMapping
    public Mono<Movement> create(@RequestBody MovementRequest request) {
        return service.processMovement(request.getAccountId(), request.getValue(), request.getType());
    }
}`
      },
      {
        name: "MovementService.java",
        path: "src/main/java/com/nttdata/account/domain/service/MovementService.java",
        language: "java",
        content: `package com.nttdata.account.domain.service;

import com.nttdata.account.domain.entity.Movement;
import com.nttdata.account.infra.exception.InsufficientBalanceException;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovementService {
    private final MovementRepository repository;
    private final AccountRepository accountRepo;

    public Mono<Movement> processMovement(Long accountId, BigDecimal value, String type) {
        log.info("Processing movement: {} for account {}", type, accountId);
        return accountRepo.findById(accountId)
            .flatMap(account -> {
                BigDecimal amount = type.equalsIgnoreCase("Retiro") ? value.negate() : value;
                BigDecimal newBalance = account.getInitialBalance().add(amount);

                if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                    return Mono.error(new InsufficientBalanceException("Saldo no disponible"));
                }

                account.setInitialBalance(newBalance);
                return accountRepo.save(account)
                    .then(repository.save(new Movement(null, LocalDateTime.now(), type, value, newBalance, account)));
            });
    }
}`
      },
      {
        name: "ReportController.java",
        path: "src/main/java/com/nttdata/account/infra/api/ReportController.java",
        language: "java",
        content: `package com.nttdata.account.infra.api;

import com.nttdata.account.domain.dto.AccountReportDTO;
import com.nttdata.account.domain.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService service;

    @GetMapping("/{clientId}")
    public Flux<AccountReportDTO> getReport(
            @PathVariable Long clientId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return service.generateReport(clientId, startDate, endDate);
    }
}`
      }
    ]
  },
  {
    name: "Tests",
    description: "Calidad Senior: Pruebas Unitarias (F5) e Integración (F6).",
    files: [
      {
        name: "MovementServiceTest.java",
        path: "src/test/java/com/nttdata/account/service/MovementServiceTest.java",
        language: "java",
        content: `package com.nttdata.account.service;

import com.nttdata.account.domain.service.MovementService;
import org.junit.jupiter.api.Test;
import reactor.test.StepVerifier;

public class MovementServiceTest {
    @Test
    void whenBalanceIsInsufficient_thenThrowCustomException() {
        // F5: Validar mensaje "Saldo no disponible"
    }
}`
      },
      {
        name: "AccountIntegrationTest.java",
        path: "src/test/java/com/nttdata/account/integration/AccountIntegrationTest.java",
        language: "java",
        content: `package com.nttdata.account.integration;

import org.springframework.test.web.reactive.server.WebTestClient;
import org.junit.jupiter.api.Test;

public class AccountIntegrationTest {
    @Test
    void testCreateAccountAndMovement() { }
}`
      }
    ]
  },
  {
    name: "Entregables",
    description: "Documentación F7 y Scripts para el Revisor.",
    files: [
      {
        name: "BaseDatos.sql",
        path: "BaseDatos.sql",
        language: "sql",
        content: `-- SQL Senior César Oleas\nCREATE TABLE persona (id SERIAL PRIMARY KEY, nombre VARCHAR(100), identificacion VARCHAR(20) UNIQUE);\nCREATE TABLE cliente (id INT PRIMARY KEY REFERENCES persona(id), contrasena VARCHAR(100), estado BOOLEAN);\nCREATE TABLE cuenta (id SERIAL PRIMARY KEY, numero_cuenta VARCHAR(20) UNIQUE, tipo_cuenta VARCHAR(20), saldo_inicial DECIMAL(15,2), cliente_id INT);\nCREATE TABLE movimiento (id SERIAL PRIMARY KEY, fecha TIMESTAMP, tipo_movimiento VARCHAR(20), valor DECIMAL(15,2), saldo DECIMAL(15,2), cuenta_id INT);`
      },
      {
        name: "openapi.yaml",
        path: "openapi.yaml",
        language: "yaml",
        content: `openapi: 3.0.0\ninfo:\n  title: API Microservicios Bancarios - César Oleas\n  version: 1.0.0\npaths:\n  /api/v1/customers:\n    post:\n      summary: "Crear Cliente"\n  /api/v1/movements:\n    post:\n      summary: "Registrar Movimiento"\n  /reports/{clientId}:\n    get:\n      summary: "Reporte Estado de Cuenta"`
      },
      {
        name: "docker-compose.yml",
        path: "docker-compose.yml",
        language: "yaml",
        content: `version: '3.8'\nservices:\n  postgres: { image: postgres:15, ports: ["5432:5432"] }\n  kafka: { image: bitnami/kafka:latest, ports: ["9092:9092"] }\n  ms-customer: { build: ./ms-customer, ports: ["8080:8080"] }\n  ms-account: { build: ./ms-account, ports: ["8081:8081"] }`
      },
      {
        name: "nttdata_test.postman_collection.json",
        path: "nttdata_test.postman_collection.json",
        language: "json",
        content: `{\n  "info": {\n    "name": "NTT DATA Senior Test - César Oleas",\n    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"\n  },\n  "item": [\n    { "name": "F1: Crear Cliente", "request": { "method": "POST", "url": "http://localhost:8080/api/v1/customers" } },\n    { "name": "F3: Validar Saldo", "request": { "method": "POST", "url": "http://localhost:8081/api/v1/movements" } }\n  ]\n}`
      },
      {
        name: "README.md",
        path: "README.md",
        language: "markdown",
        content: `# NTT DATA SENIOR TEST - CÉSAR OLEAS\n## Ejecución en IntelliJ IDEA\n1. Asegúrate de que Docker esté corriendo (\`docker-compose up -d\`).\n2. Para **ms-customer**: Ejecuta \`CustomerApplication.java\`.\n3. Para **ms-account**: Ejecuta \`AccountApplication.java\`.\n4. Importa la colección de Postman para pruebas.`
      }
    ]
  }
];
