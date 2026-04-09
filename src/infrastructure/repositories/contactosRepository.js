const pool = require('../database/mysql');

class ContactosRepository {
    async createContacto(data) {
        const [result] = await pool.query(
            `INSERT INTO contactos (nombre, telefono, parentesco, user_id)
            VALUES (?, ?, ?, ?)`,
            [data.nombre, data.telefono, data.parentesco, data.user_id]
        );
        return result;
    }

    async getContactosByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM contactos WHERE user_id = ? ORDER BY id',
            [userId]
        );
        return rows;
    }
}

module.exports = ContactosRepository;
