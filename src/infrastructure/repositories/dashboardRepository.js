const { pool } = require('../database/mysql');

class DashboardRepository {
    async getUserFullName(userId) {
        const [rows] = await pool.query('SELECT full_name FROM users WHERE id = ?', [userId]);
        return rows[0]?.full_name || null;
    }

    async getInformacionMedica(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM informacion_medica WHERE user_id = ?',
            [userId]
        );
        return rows[0];
    }

    async getContactosEmergencia(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM contactos_emergencia WHERE user_id = ? ORDER BY es_principal DESC',
            [userId]
        );
        return rows;
    }

    async createContactoEmergencia(userId, contactoData) {
        const [result] = await pool.query(
            'INSERT INTO contactos_emergencia (user_id, nombre, telefono, relacion) VALUES (?, ?, ?, ?)',
            [userId, contactoData.nombre, contactoData.telefono, contactoData.relacion]
        );
        return result;
    }

    async getPerfilPublico(userId) {
        // Obtener información médica
        const [informacionMedica] = await pool.query(
            'SELECT * FROM informacion_medica WHERE user_id = ?',
            [userId]
        );

        // Obtener alergias
        const [alergias] = await pool.query(
            'SELECT * FROM alergias WHERE user_id = ?',
            [userId]
        );

        // Obtener medicamentos
        const [medicamentos] = await pool.query(
            'SELECT * FROM medicamentos WHERE user_id = ?',
            [userId]
        );

        // Obtener enfermedades base
        const [enfermedadesBase] = await pool.query(
            'SELECT * FROM enfermedades_base WHERE user_id = ?',
            [userId]
        );

        // Obtener contactos de emergencia
        const [contactosEmergencia] = await pool.query(
            'SELECT * FROM contactos_emergencia WHERE user_id = ? ORDER BY es_principal DESC',
            [userId]
        );

        return {
            informacion_medica: informacionMedica[0] || null,
            alergias,
            medicamentos,
            enfermedades_base: enfermedadesBase,
            contactos_emergencia: contactosEmergencia
        };
    }

    async upsertInformacionMedica(userId, data) {
        const fallbackNombreCompleto = data.nombre_completo || await this.getUserFullName(userId) || 'Sin nombre';

        const attempts = [
            {
                updateSql: `UPDATE informacion_medica
                    SET nombre_completo = ?,
                        tipo_documento = ?,
                        numero_documento = ?,
                        fecha_nacimiento = ?,
                        numero_telefono = ?,
                        grupo_sanguineo = ?
                    WHERE user_id = ?`,
                updateParams: [
                    data.nombre_completo || fallbackNombreCompleto,
                    data.tipo_documento || null,
                    data.numero_documento || null,
                    data.fecha_nacimiento || null,
                    data.numero_telefono || null,
                    data.grupo_sanguineo || null,
                    userId
                ],
                insertSql: `INSERT INTO informacion_medica
                    (user_id, nombre_completo, tipo_documento, numero_documento, fecha_nacimiento, numero_telefono, grupo_sanguineo)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                insertParams: [
                    userId,
                    fallbackNombreCompleto,
                    data.tipo_documento || null,
                    data.numero_documento || null,
                    data.fecha_nacimiento || null,
                    data.numero_telefono || null,
                    data.grupo_sanguineo || null
                ]
            },
            {
                updateSql: `UPDATE informacion_medica
                    SET tipo_sangre = ?,
                        alergias = ?,
                        medicamentos = ?,
                        notas_medicas = ?
                    WHERE user_id = ?`,
                updateParams: [
                    data.tipo_sangre || data.grupo_sanguineo || null,
                    data.alergias || null,
                    data.medicamentos || null,
                    data.notas_medicas || null,
                    userId
                ],
                insertSql: `INSERT INTO informacion_medica
                    (user_id, tipo_sangre, alergias, medicamentos, notas_medicas)
                    VALUES (?, ?, ?, ?, ?)`,
                insertParams: [
                    userId,
                    data.tipo_sangre || data.grupo_sanguineo || null,
                    data.alergias || null,
                    data.medicamentos || null,
                    data.notas_medicas || null
                ]
            }
        ];

        let lastError;

        for (const attempt of attempts) {
            try {
                const [updateResult] = await pool.query(attempt.updateSql, attempt.updateParams);
                if (updateResult.affectedRows > 0) {
                    return updateResult;
                }

                const [insertResult] = await pool.query(attempt.insertSql, attempt.insertParams);
                return insertResult;
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

module.exports = DashboardRepository;