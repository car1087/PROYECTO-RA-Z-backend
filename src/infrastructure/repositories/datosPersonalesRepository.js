const { pool } = require('../database/mysql');

class DatosPersonalesRepository {
    async getDatosPersonales(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM informacion_medica WHERE user_id = ?',
            [userId]
        );
        return rows[0];
    }

    async saveDatosPersonales(userId, data) {
        console.log('Repository - User ID:', userId);
        console.log('Repository - Data:', data);

        const [existing] = await pool.query(
            'SELECT user_id FROM informacion_medica WHERE user_id = ?',
            [userId]
        );

        console.log('Repository - Existing records:', existing.length);

        if (existing.length > 0) {
            console.log('Repository - Updating existing record');
            // Update
            const [result] = await pool.query(
                `UPDATE informacion_medica
                SET nombre_completo = ?, tipo_documento = ?, numero_documento = ?,
                    fecha_nacimiento = ?, grupo_sanguineo = ?, numero_telefono = ?
                WHERE user_id = ?`,
                [data.nombre_completo, data.tipo_documento, data.numero_documento,
                 data.fecha_nacimiento, data.grupo_sanguineo, data.numero_telefono, userId]
            );
            console.log('Repository - Update result:', result);
            return result;
        } else {
            console.log('Repository - Inserting new record');
            // Insert
            const [result] = await pool.query(
                `INSERT INTO informacion_medica
                (user_id, nombre_completo, tipo_documento, numero_documento,
                 fecha_nacimiento, grupo_sanguineo, numero_telefono)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, data.nombre_completo, data.tipo_documento, data.numero_documento,
                 data.fecha_nacimiento, data.grupo_sanguineo, data.numero_telefono]
            );
            console.log('Repository - Insert result:', result);
            return result;
        }
    }
}

module.exports = DatosPersonalesRepository;