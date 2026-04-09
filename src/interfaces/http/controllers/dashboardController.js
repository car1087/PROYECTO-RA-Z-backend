class DashboardController {
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    normalizeDate(value) {
        if (!value) return null;

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date.toISOString().split('T')[0];
    }

    async getInformacionMedica(req, res) {
        try {
            const userId = req.user.id;
            const informacion = await this.dashboardRepository.getInformacionMedica(userId);
            
            if (!informacion) {
                return res.json({
                    tipo_sangre: null,
                    alergias: null,
                    medicamentos: null,
                    notas_medicas: null
                });
            }

            res.json(informacion);
        } catch (error) {
            console.error('Error al obtener información médica:', error);
            res.status(500).json({ error: 'Error al obtener información médica' });
        }
    }

    async getContactosEmergencia(req, res) {
        try {
            const userId = req.user.id;
            const contactos = await this.dashboardRepository.getContactosEmergencia(userId);
            res.json(contactos);
        } catch (error) {
            console.error('Error al obtener contactos de emergencia:', error);
            res.status(500).json({ error: 'Error al obtener contactos de emergencia' });
        }
    }

    async createContactoEmergencia(req, res) {
        try {
            const userId = req.user.id;
            const { nombre, telefono, relacion } = req.body;

            // Validaciones básicas
            if (!nombre || !telefono || !relacion) {
                return res.status(400).json({ error: 'Nombre, teléfono y relación son requeridos' });
            }

            const result = await this.dashboardRepository.createContactoEmergencia(userId, {
                nombre,
                telefono,
                relacion
            });

            res.status(201).json({ message: 'Contacto de emergencia creado correctamente', id: result.insertId });
        } catch (error) {
            console.error('--- ERROR AL CREAR CONTACTO ---');
            console.error(error); // Imprime el error completo
            res.status(500).json({ error: 'Error al procesar la solicitud', message: error.message });
        }
    }

    async getPerfilPublico(req, res) {
        try {
            const { id } = req.params;
            const perfil = await this.dashboardRepository.getPerfilPublico(id);
            res.json(perfil);
        } catch (error) {
            console.error('Error al obtener perfil público:', error);
            res.status(500).json({ error: 'Error al obtener perfil público' });
        }
    }

    async updateInformacionMedica(req, res) {
        try {
            const userId = req.user.id;

            const fechaFormateada = this.normalizeDate(req.body.fecha_nacimiento);

            // Crea el objeto de datos usando el spread operator
            const dataParaGuardar = { ...req.body, fecha_nacimiento: fechaFormateada };

            // Pasa el objeto completo al repositorio
            const result = await this.dashboardRepository.upsertInformacionMedica(userId, dataParaGuardar);

            res.json({ message: 'Información médica actualizada correctamente' });
        } catch (error) {
            console.error('Error al actualizar información médica:', error);
            res.status(500).json({
                message: 'Error al actualizar información médica',
                error: 'Error al actualizar información médica',
                code: error.code || null,
                detail: error.message || null
            });
        }
    }
}

module.exports = DashboardController;