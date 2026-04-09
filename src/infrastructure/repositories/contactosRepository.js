const { pool } = require('../database/mysql');

class ContactosRepository {
    async createContacto(data) {
        const attempts = [
            {
                sql: 'INSERT INTO contactos (user_id, nombre, telefono, relacion) VALUES (?, ?, ?, ?)',
                params: [data.user_id, data.nombre, data.telefono, data.relacion]
            },
            {
                sql: 'INSERT INTO contactos (user_id, nombre, telefono, parentesco) VALUES (?, ?, ?, ?)',
                params: [data.user_id, data.nombre, data.telefono, data.relacion]
            },
            {
                sql: 'INSERT INTO contactos_emergencia (user_id, nombre, telefono, relacion) VALUES (?, ?, ?, ?)',
                params: [data.user_id, data.nombre, data.telefono, data.relacion]
            },
            {
                sql: 'INSERT INTO contactos_emergencia (user_id, nombre, telefono, parentesco) VALUES (?, ?, ?, ?)',
                params: [data.user_id, data.nombre, data.telefono, data.relacion]
            }
        ];

        let lastError;
        for (const attempt of attempts) {
            try {
                const [result] = await pool.query(attempt.sql, attempt.params);
                return result;
            } catch (error) {
                const recoverable = error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_BAD_FIELD_ERROR';
                if (!recoverable) {
                    throw error;
                }
                lastError = error;
            }
        }

        throw lastError;
    }

    async getContactosByUserId(userId) {
        const attempts = [
            {
                sql: 'SELECT id, user_id, nombre, telefono, relacion FROM contactos WHERE user_id = ? ORDER BY id DESC',
                normalize: (rows) => rows
            },
            {
                sql: 'SELECT id, user_id, nombre, telefono, parentesco FROM contactos WHERE user_id = ? ORDER BY id DESC',
                normalize: (rows) => rows.map((row) => ({ ...row, relacion: row.parentesco }))
            },
            {
                sql: 'SELECT id, user_id, nombre, telefono, relacion FROM contactos_emergencia WHERE user_id = ? ORDER BY id DESC',
                normalize: (rows) => rows
            },
            {
                sql: 'SELECT id, user_id, nombre, telefono, parentesco FROM contactos_emergencia WHERE user_id = ? ORDER BY id DESC',
                normalize: (rows) => rows.map((row) => ({ ...row, relacion: row.parentesco }))
            }
        ];

        let lastError;
        for (const attempt of attempts) {
            try {
                const [rows] = await pool.query(attempt.sql, [userId]);
                return attempt.normalize(rows);
            } catch (error) {
                const recoverable = error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_BAD_FIELD_ERROR';
                if (!recoverable) {
                    throw error;
                }
                lastError = error;
            }
        }

        throw lastError;
    }
}

module.exports = ContactosRepository;
