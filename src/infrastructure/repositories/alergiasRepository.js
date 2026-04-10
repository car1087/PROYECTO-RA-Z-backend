const { pool } = require('../database/mysql');

class AlergiasRepository {
    async getAlergiasColumns() {
        const [rows] = await pool.query('SHOW COLUMNS FROM alergias');
        return rows.map((row) => row.Field);
    }

    pickFirstExisting(columns, candidates) {
        for (const name of candidates) {
            if (columns.includes(name)) return name;
        }
        return null;
    }

    buildAlergiaMapping(columns) {
        return {
            tipo: this.pickFirstExisting(columns, ['tipo_alergia', 'tipo', 'categoria']),
            severidad: this.pickFirstExisting(columns, ['severidad_reaccion', 'severidad']),
            sustancia: this.pickFirstExisting(columns, ['sustancia', 'alergeno', 'nombre']),
            observaciones: this.pickFirstExisting(columns, ['observaciones', 'notas', 'descripcion'])
        };
    }

    async getAlergiasByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM alergias WHERE user_id = ? ORDER BY id',
            [userId]
        );
        return rows;
    }

    async createAlergia(userId, data) {
        const columns = await this.getAlergiasColumns();
        const mapping = this.buildAlergiaMapping(columns);

        if (!mapping.tipo || !mapping.severidad || !mapping.sustancia) {
            throw new Error('La tabla alergias no tiene las columnas minimas requeridas para guardar');
        }

        const insertCols = ['user_id', mapping.tipo, mapping.severidad, mapping.sustancia];
        const values = [userId, data.tipo_alergia, data.severidad_reaccion, data.sustancia];

        if (mapping.observaciones) {
            insertCols.push(mapping.observaciones);
            values.push(data.observaciones || null);
        }

        const placeholders = insertCols.map(() => '?').join(', ');
        const [result] = await pool.query(
            `INSERT INTO alergias (${insertCols.join(', ')}) VALUES (${placeholders})`,
            values
        );
        return result;
    }

    async updateAlergia(id, userId, data) {
        const columns = await this.getAlergiasColumns();
        const mapping = this.buildAlergiaMapping(columns);

        if (!mapping.tipo || !mapping.severidad || !mapping.sustancia) {
            throw new Error('La tabla alergias no tiene las columnas minimas requeridas para actualizar');
        }

        const setClauses = [
            `${mapping.tipo} = ?`,
            `${mapping.severidad} = ?`,
            `${mapping.sustancia} = ?`
        ];

        const values = [data.tipo_alergia, data.severidad_reaccion, data.sustancia];

        if (mapping.observaciones) {
            setClauses.push(`${mapping.observaciones} = ?`);
            values.push(data.observaciones || null);
        }

        values.push(id, userId);

        const [result] = await pool.query(
            `UPDATE alergias SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`,
            values
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