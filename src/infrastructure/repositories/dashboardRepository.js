const pool = require('../database/mysql');

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

    async updateContacto(id, userId, data) {
        const [result] = await pool.query(
            'UPDATE contactos_emergencia SET nombre = ?, telefono = ?, relacion = ? WHERE id = ? AND user_id = ?',
            [data.nombre, data.telefono, data.relacion, id, userId]
        );
        return result;
    }

    async deleteContacto(userId, id) {
        const [result] = await pool.query(
            'DELETE FROM contactos_emergencia WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result;
    }

    async getPerfilPublico(userId) {
        try {
            // Ejecutar todas las consultas simultáneamente usando Promise.all
            const [
                [informacionMedica],
                [alergias],
                [medicamentos],
                [enfermedadesBase],
                [contactosEmergencia]
            ] = await Promise.all([
                pool.query('SELECT * FROM informacion_medica WHERE user_id = ?', [userId]),
                pool.query('SELECT * FROM alergias WHERE user_id = ?', [userId]),
                pool.query('SELECT * FROM medicamentos WHERE user_id = ?', [userId]),
                pool.query('SELECT * FROM enfermedades_base WHERE user_id = ?', [userId]),
                pool.query('SELECT * FROM contactos_emergencia WHERE user_id = ? ORDER BY es_principal DESC', [userId])
            ]);

            return {
                informacion_medica: informacionMedica[0] || null,
                alergias,
                medicamentos,
                enfermedades_base: enfermedadesBase,
                contactos_emergencia: contactosEmergencia
            };
        } catch (error) {
            console.error('Error FATAL en getPerfilPublico (Repository):', error);
            throw error; // Esto lanza el error al Controlador.
        }
    }

    async getEstadoDispositivo(userId) {
        const [rows] = await pool.query(
            'SELECT estado FROM dispositivos_qr WHERE user_id = ?',
            [userId]
        );
        return rows[0] ? { estado: rows[0].estado } : { estado: 'Inactivo' };
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