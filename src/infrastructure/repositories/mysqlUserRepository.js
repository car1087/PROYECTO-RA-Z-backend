const UserRepository = require('../../domain/repositories/userRepository');
const { pool } = require('../database/mysql');

class MysqlUserRepository extends UserRepository {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
    return rows[0];
  }

  async getRoleIdByCode(roleCode) {
    const [rows] = await pool.query(
      'SELECT id FROM roles WHERE code = ?',
      [roleCode]
    );
    return rows[0]?.id;
  }

  async create(user) {
    // Obtener el ID del rol (por defecto 'usuario' si no se especifica)
    const roleId = await this.getRoleIdByCode(user.roleCode || 'usuario');
    if (!roleId) {
      throw new Error('Rol no válido');
    }

    const [result] = await pool.query(
      `INSERT INTO users (
        email, 
        password_hash, 
        full_name,
        doc_type,
        doc_number,
        phone,
        role_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.email,
        user.password_hash,
        user.fullName,
        user.docType,
        user.docNumber,
        user.phone,
        roleId
      ]
    );
    return result.insertId;
  }
}

module.exports = MysqlUserRepository;