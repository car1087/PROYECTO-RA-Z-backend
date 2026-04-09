const { pool } = require('../database/mysql');

class ContactosRepository {
    async createContacto(data) {
        const [result] = await pool.query(
            `INSERT INTO contactos (user_id, nombre, telefono, relacion)
            VALUES (?, ?, ?, ?)`,
            [data.user_id, data.nombre, data.telefono, data.relacion]
        );
        return result;
    }

    async getContactosByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT id, user_id, nombre, telefono, relacion FROM contactos WHERE user_id = ? ORDER BY id DESC',
            [userId]
        );
        return rows;
    }
}

module.exports = ContactosRepository;
