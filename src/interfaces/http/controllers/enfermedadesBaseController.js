class EnfermedadesBaseController {
    constructor(enfermedadesBaseRepository) {
        this.enfermedadesBaseRepository = enfermedadesBaseRepository;
    }

    async getEnfermedades(req, res) {
        try {
            // LOG TEMP: registrar quién solicita la lista
            console.log('[LOG] GET /enfermedades-base - ip:', req.ip, 'user-agent:', req.headers['user-agent']);
            console.log('[LOG] req.user:', req.user);
            const userId = req.user.id;
            const enfermedades = await this.enfermedadesBaseRepository.getEnfermedadesByUserId(userId);
            res.json(enfermedades);
        } catch (error) {
            console.error('Error al obtener enfermedades:', error);
            res.status(500).json({ error: 'Error al obtener enfermedades' });
        }
    }

    async createEnfermedad(req, res) {
        try {
            // LOG TEMP: registrar intento de creación desde UI
            console.log('[LOG] POST /enfermedades-base - ip:', req.ip, 'user-agent:', req.headers['user-agent']);
            console.log('[LOG] req.user:', req.user);
            console.log('[LOG] body:', req.body);
            const userId = req.user.id;
            const { nombre_enfermedad } = req.body;

            if (!nombre_enfermedad) {
                return res.status(400).json({ error: 'El nombre de la enfermedad es requerido' });
            }

            const result = await this.enfermedadesBaseRepository.createEnfermedad(userId, nombre_enfermedad);
            res.status(201).json({ message: 'Enfermedad creada correctamente', id: result.insertId });
        } catch (error) {
            console.error('Error al crear enfermedad:', error);
            res.status(500).json({ error: 'Error al crear enfermedad' });
        }
    }

    async updateEnfermedad(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { nombre_enfermedad } = req.body;

            if (!nombre_enfermedad) {
                return res.status(400).json({ error: 'El nombre de la enfermedad es requerido' });
            }

            const result = await this.enfermedadesBaseRepository.updateEnfermedad(id, userId, nombre_enfermedad);

            res.status(200).json({ message: 'Enfermedad actualizada' });
        } catch (error) {
            console.error('Error al actualizar enfermedad:', error);
            res.status(500).json({ error: 'Error al actualizar enfermedad' });
        }
    }

    async deleteEnfermedad(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const result = await this.enfermedadesBaseRepository.deleteEnfermedad(id, userId);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Enfermedad no encontrada' });
            }

            res.json({ message: 'Enfermedad eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar enfermedad:', error);
            res.status(500).json({ error: 'Error al eliminar enfermedad' });
        }
    }
}

module.exports = EnfermedadesBaseController;