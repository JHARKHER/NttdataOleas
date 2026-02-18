# Solución Técnica NTT DATA - Perfil Senior

**Candidato:** César Oleas  
**GitHub:** https://github.com/JHARKHER/NttdataOleas.git

**Hardware:** MAC M1 APPLE SILICON

## Arquitectura y Tecnologías
- **Java 17 + Spring Boot 3**
- **Spring WebFlux:** Programación reactiva de extremo a extremo para alto rendimiento.
- **Kafka:** Comunicación asíncrona entre microservicios para desacoplamiento (Requerimiento Senior).
- **PostgreSQL:** Base de datos relacional para persistencia de datos bancarios.
- **Docker & Docker Compose:** Orquestación completa de la infraestructura.

## Entregables Incluidos en este Repositorio
1. **BaseDatos.sql:** Script DDL para la creación de tablas.
2. **openapi.yaml:** Contrato de API siguiendo el enfoque Contract First.
3. **Colección Postman:** Archivo JSON con pruebas automatizadas para validar F1, F2, F3 y F4.
4. **Microservicios:** Código fuente de `ms-customer` y `ms-account`.

## Instrucciones de Ejecución
Para levantar el entorno completo y realizar las pruebas:

1. **Levantar Infraestructura:** En la raíz del proyecto, ejecute:
   ```bash
   docker compose up --build
   ```
2. **Puertos de los Servicios:**
   - ms-customer: `8080`
   - ms-account: `8081`
   - Postgres: `5432`
   - Kafka: `9092`
3. **Pruebas:** Importe la colección de Postman y ejecute los requests. El test de "Saldo no disponible" valida específicamente el requerimiento F3 del PDF.
