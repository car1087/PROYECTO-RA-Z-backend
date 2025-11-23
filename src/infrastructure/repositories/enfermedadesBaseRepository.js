const pool = require('../database/mysql');

class EnfermedadesBaseRepository {
    async getEnfermedadesByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM enfermedades_base WHERE user_id = ? ORDER BY id',
            [userId]
        );
        return rows;
    }

    async createEnfermedad(userId, nombreEnfermedad) {
        const [result] = await pool.query(
            `INSERT INTO enfermedades_base (user_id, nombre_enfermedad, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
            [userId, nombreEnfermedad]
        );
        return result;
    }

    async updateEnfermedad(id, userId, nombreEnfermedad) {
        const [result] = await pool.query(
            `UPDATE enfermedades_base
            SET nombre_enfermedad = ?
            WHERE id = ? AND user_id = ?`,
            [nombreEnfermedad, id, userId]
        );
        return result;
    }

    async deleteEnfermedad(id, userId) {
        const [result] = await pool.query(
            'DELETE FROM enfermedades_base WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result;
    }
}

module.exports = EnfermedadesBaseRepository;