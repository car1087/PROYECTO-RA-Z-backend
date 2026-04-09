const { pool } = require('../database/mysql');

class DatosPersonalesRepository {
    normalizeDate(value) {
        if (!value) return null;

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date.toISOString().split('T')[0];
    }

    async getInformacionMedicaColumns() {
        const [rows] = await pool.query('SHOW COLUMNS FROM informacion_medica');
        return rows.map((row) => row.Field);
    }

    async getDatosPersonales(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM informacion_medica WHERE user_id = ?',
            [userId]
        );
        return rows[0];
    }

    async saveDatosPersonales(userId, data) {
        const columns = await this.getInformacionMedicaColumns();

        const normalizedData = {
            nombre_completo: data.nombre_completo || null,
            tipo_documento: data.tipo_documento || null,
            numero_documento: data.numero_documento || null,
            fecha_nacimiento: this.normalizeDate(data.fecha_nacimiento),
            grupo_sanguineo: data.grupo_sanguineo || null,
            tipo_sangre: data.grupo_sanguineo || data.tipo_sangre || null,
            numero_telefono: data.numero_telefono || null
        };

        const mappings = [
            ['nombre_completo', 'nombre_completo'],
            ['tipo_documento', 'tipo_documento'],
            ['numero_documento', 'numero_documento'],
            ['fecha_nacimiento', 'fecha_nacimiento'],
            ['grupo_sanguineo', 'grupo_sanguineo'],
            ['tipo_sangre', 'tipo_sangre'],
            ['numero_telefono', 'numero_telefono']
        ];

        const fieldsToPersist = mappings
            .filter(([dbColumn]) => columns.includes(dbColumn))
            .map(([dbColumn, sourceField]) => ({
                dbColumn,
                value: normalizedData[sourceField]
            }));

        if (fieldsToPersist.length === 0) {
            const error = new Error('La tabla informacion_medica no tiene columnas compatibles para guardar datos personales');
            error.code = 'INCOMPATIBLE_SCHEMA';
            throw error;
        }

        const [existing] = await pool.query(
            'SELECT user_id FROM informacion_medica WHERE user_id = ?',
            [userId]
        );

        if (existing.length > 0) {
            const setClause = fieldsToPersist.map((field) => `${field.dbColumn} = ?`).join(', ');
            const updateParams = fieldsToPersist.map((field) => field.value);
            updateParams.push(userId);

            const [result] = await pool.query(
                `UPDATE informacion_medica SET ${setClause} WHERE user_id = ?`,
                updateParams
            );

            return result;
        }

        const insertColumns = ['user_id', ...fieldsToPersist.map((field) => field.dbColumn)];
        const placeholders = insertColumns.map(() => '?').join(', ');
        const insertParams = [userId, ...fieldsToPersist.map((field) => field.value)];

        const [result] = await pool.query(
            `INSERT INTO informacion_medica (${insertColumns.join(', ')}) VALUES (${placeholders})`,
            insertParams
        );

        return result;
    }
}

module.exports = DatosPersonalesRepository;