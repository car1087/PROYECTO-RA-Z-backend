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
        const [columnsRows] = await pool.query('SHOW COLUMNS FROM informacion_medica');
        const availableColumns = new Set(columnsRows.map((row) => row.Field));

        const fallbackNombreCompleto = data.nombre_completo || await this.getUserFullName(userId) || 'Sin nombre';

        const normalizedData = {
            nombre_completo: fallbackNombreCompleto,
            tipo_documento: data.tipo_documento || null,
            numero_documento: data.numero_documento || null,
            fecha_nacimiento: data.fecha_nacimiento || null,
            numero_telefono: data.numero_telefono || null,
            grupo_sanguineo: data.grupo_sanguineo || data.tipo_sangre || null,
            tipo_sangre: data.tipo_sangre || data.grupo_sanguineo || null,
            alergias: data.alergias || null,
            medicamentos: data.medicamentos || null,
            notas_medicas: data.notas_medicas || null
        };

        const fieldsToPersist = Object.entries(normalizedData)
            .filter(([column]) => availableColumns.has(column))
            .map(([column, value]) => ({ column, value }));

        if (fieldsToPersist.length === 0) {
            const error = new Error('La tabla informacion_medica no tiene columnas compatibles para guardar informacion');
            error.code = 'INCOMPATIBLE_SCHEMA';
            throw error;
        }

        const [existing] = await pool.query(
            'SELECT user_id FROM informacion_medica WHERE user_id = ?',
            [userId]
        );

        if (existing.length > 0) {
            const setClause = fieldsToPersist.map((field) => `${field.column} = ?`).join(', ');
            const updateParams = fieldsToPersist.map((field) => field.value);
            updateParams.push(userId);

            const [updateResult] = await pool.query(
                `UPDATE informacion_medica SET ${setClause} WHERE user_id = ?`,
                updateParams
            );

            return updateResult;
        }

        const insertColumns = ['user_id', ...fieldsToPersist.map((field) => field.column)];
        const placeholders = insertColumns.map(() => '?').join(', ');
        const insertParams = [userId, ...fieldsToPersist.map((field) => field.value)];

        const [insertResult] = await pool.query(
            `INSERT INTO informacion_medica (${insertColumns.join(', ')}) VALUES (${placeholders})`,
            insertParams
        );

        return insertResult;
    }
}

module.exports = DashboardRepository;