CREATE DATABASE IF NOT EXISTS proyecto_pild;
USE proyecto_pild;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles por defecto
INSERT IGNORE INTO roles (code, name) VALUES ('admin', 'Administrador');
INSERT IGNORE INTO roles (code, name) VALUES ('usuario', 'Usuario');

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  doc_type VARCHAR(10),
  doc_number VARCHAR(50),
  phone VARCHAR(32),
  role_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);