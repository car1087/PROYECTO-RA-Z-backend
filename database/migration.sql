USE proyecto_pild;

-- Crear tabla roles si no existe
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles por defecto si no existen
INSERT IGNORE INTO roles (code, name) VALUES ('admin', 'Administrador');
INSERT IGNORE INTO roles (code, name) VALUES ('usuario', 'Usuario');

-- Agregar columnas faltantes a users
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN doc_type VARCHAR(10);
ALTER TABLE users ADD COLUMN doc_number VARCHAR(50);
ALTER TABLE users ADD COLUMN phone VARCHAR(32);
ALTER TABLE users ADD COLUMN role_id INT;
ALTER TABLE users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id);

-- Actualizar usuarios existentes para que tengan role_id por defecto
UPDATE users SET role_id = (SELECT id FROM roles WHERE code = 'usuario') WHERE role_id IS NULL;