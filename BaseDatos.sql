-- Script Base de Datos - Solución Senior César Oleas
CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    genero VARCHAR(20),
    identificacion VARCHAR(20) UNIQUE NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20)
);

CREATE TABLE cliente (
    id INT PRIMARY KEY REFERENCES persona(id),
    contrasena VARCHAR(100) NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE cuenta (
    id SERIAL PRIMARY KEY,
    numero_cuenta VARCHAR(20) UNIQUE NOT NULL,
    tipo_cuenta VARCHAR(20) NOT NULL,
    saldo_inicial DECIMAL(15,2) DEFAULT 0.00,
    estado BOOLEAN DEFAULT TRUE,
    cliente_id INT REFERENCES cliente(id)
);

CREATE TABLE movimiento (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_movimiento VARCHAR(20) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    saldo DECIMAL(15,2) NOT NULL,
    cuenta_id INT REFERENCES cuenta(id)
);