const { pool } = require('../database/mysql');

class MedicamentosRepository {
    async getCantidadDosisColumn() {
        const [rows] = await pool.query('SHOW COLUMNS FROM medicamentos');
        const columns = rows.map((row) => row.Field);
        if (columns.includes('cantidad_dosis_dia')) return 'cantidad_dosis_dia';
        if (columns.includes('cantidad_dosis')) return 'cantidad_dosis';
        return null;
    }

    async getMedicamentosByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM medicamentos WHERE user_id = ?',
            [userId]
        );
        return rows;
    }

    async createMedicamento(userId, data) {
        const cantidadCol = await this.getCantidadDosisColumn();
        const cantidadVal = data.cantidad_dosis_dia ?? data.cantidad_dosis ?? null;

        if (cantidadCol) {
            const [result] = await pool.query(
                `INSERT INTO medicamentos (user_id, nombre_medicamento, dosis, via_administracion, ${cantidadCol}) VALUES (?, ?, ?, ?, ?)`,
                [userId, data.nombre_medicamento, data.dosis, data.via_administracion, cantidadVal]
            );
            return result;
        }

        const [result] = await pool.query(
            `INSERT INTO medicamentos (user_id, nombre_medicamento, dosis, via_administracion) VALUES (?, ?, ?, ?)`,
            [userId, data.nombre_medicamento, data.dosis, data.via_administracion]
        );
        return result;
    }

    async updateMedicamento(id, userId, data) {
        const cantidadCol = await this.getCantidadDosisColumn();
        const cantidadVal = data.cantidad_dosis_dia ?? data.cantidad_dosis ?? null;

        if (cantidadCol) {
            const [result] = await pool.query(
                `UPDATE medicamentos SET nombre_medicamento = ?, dosis = ?, via_administracion = ?, ${cantidadCol} = ? WHERE id = ? AND user_id = ?`,
                [data.nombre_medicamento, data.dosis, data.via_administracion, cantidadVal, id, userId]
            );
            return result;
        }

        const [result] = await pool.query(
            `UPDATE medicamentos SET nombre_medicamento = ?, dosis = ?, via_administracion = ? WHERE id = ? AND user_id = ?`,
            [data.nombre_medicamento, data.dosis, data.via_administracion, id, userId]
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