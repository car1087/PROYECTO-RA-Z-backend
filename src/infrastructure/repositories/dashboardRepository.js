const { pool } = require('../database/mysql');

class DashboardRepository {
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
        const [result] = await pool.query(
            `INSERT INTO informacion_medica
            (user_id, nombre_completo, tipo_documento, numero_documento, fecha_nacimiento, numero_telefono, grupo_sanguineo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                nombre_completo = VALUES(nombre_completo),
                tipo_documento = VALUES(tipo_documento),
                numero_documento = VALUES(numero_documento),
                fecha_nacimiento = VALUES(fecha_nacimiento),
                numero_telefono = VALUES(numero_telefono),
                grupo_sanguineo = VALUES(grupo_sanguineo)`,
            [userId, data.nombre_completo, data.tipo_documento, data.numero_documento, data.fecha_nacimiento, data.numero_telefono, data.grupo_sanguineo]
        );
        return result;
    }
}

module.exports = DashboardRepository;