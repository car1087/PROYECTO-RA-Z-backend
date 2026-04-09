const { pool } = require('../database/mysql');

class MedicamentosRepository {
    async getMedicamentosByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM medicamentos WHERE user_id = ?',
            [userId]
        );
        return rows;
    }

    async createMedicamento(userId, data) {
        const [result] = await pool.query(
            `INSERT INTO medicamentos
            (user_id, nombre_medicamento, dosis, via_administracion, cantidad_dosis_dia)
            VALUES (?, ?, ?, ?, ?)`,
            [userId, data.nombre_medicamento, data.dosis, data.via_administracion, data.cantidad_dosis_dia]
        );
        return result;
    }

    async updateMedicamento(id, userId, data) {
        const [result] = await pool.query(
            `UPDATE medicamentos
            SET nombre_medicamento = ?, dosis = ?, via_administracion = ?, cantidad_dosis_dia = ?
            WHERE id = ? AND user_id = ?`,
            [data.nombre_medicamento, data.dosis, data.via_administracion, data.cantidad_dosis_dia, id, userId]
        );
        return result;
    }

    async deleteMedicamento(id, userId) {
        const [result] = await pool.query(
            'DELETE FROM medicamentos WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result;
    }
}

module.exports = MedicamentosRepository;