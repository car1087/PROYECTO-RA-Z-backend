const { pool } = require('../database/mysql');

class AlergiasRepository {
    async getAlergiasByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM alergias WHERE user_id = ? ORDER BY id',
            [userId]
        );
        return rows;
    }

    async createAlergia(userId, data) {
        const [result] = await pool.query(
            `INSERT INTO alergias (user_id, tipo_alergia, severidad_reaccion, sustancia, observaciones)
            VALUES (?, ?, ?, ?, ?)`,
            [userId, data.tipo_alergia, data.severidad_reaccion, data.sustancia, data.observaciones || null]
        );
        return result;
    }
    async updateAlergia(id, userId, data) {
        const [result] = await pool.query(
            `UPDATE alergias
            SET tipo_alergia = ?, severidad_reaccion = ?, sustancia = ?, observaciones = ?
            WHERE id = ? AND user_id = ?`,
            [data.tipo_alergia, data.severidad_reaccion, data.sustancia, data.observaciones || null, id, userId]
        );
        return result;
    }

    async deleteAlergia(id, userId) {
        const [result] = await pool.query(
            'DELETE FROM alergias WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result;
    }
}

module.exports = AlergiasRepository;