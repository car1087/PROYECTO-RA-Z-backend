class DashboardController {
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
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

    async updateContactoEmergencia(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { nombre, telefono, relacion } = req.body;

            if (!nombre || !telefono || !relacion) {
                return res.status(400).json({ error: 'Nombre, teléfono y relación son requeridos' });
            }

            const result = await this.dashboardRepository.updateContacto(id, userId, {
                nombre,
                telefono,
                relacion
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Contacto no encontrado' });
            }

            res.json({ message: 'Contacto actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar contacto:', error);
            res.status(500).json({ error: 'Error al actualizar contacto' });
        }
    }

    async deleteContactoEmergencia(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const result = await this.dashboardRepository.deleteContacto(userId, id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Contacto no encontrado' });
            }

            res.json({ message: 'Contacto eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar contacto:', error);
            res.status(500).json({ error: 'Error al eliminar contacto' });
        }
    }

    async getPerfilPublico(req, res) {
        try {
            console.log('*** INICIANDO RUTA PÚBLICA DE PERFIL ***');
            const { id } = req.params;
            const userIdInt = parseInt(id, 10); // CONVERSIÓN CRÍTICA
            const perfil = await this.dashboardRepository.getPerfilPublico(userIdInt); // PASA EL NÚMERO
            res.json(perfil);
        } catch (error) {
            console.error('Error al obtener perfil público:', error);
            res.status(500).json({ error: 'Error al obtener perfil público' });
        }
    }

    async getEstadoDispositivo(req, res) {
        try {
            const userId = req.user.id;
            const estado = await this.dashboardRepository.getEstadoDispositivo(userId);
            res.json(estado);
        } catch (error) {
            console.error('Error al obtener estado del dispositivo:', error);
            res.status(500).json({ error: 'Error al obtener estado del dispositivo' });
        }
    }

    async updateInformacionMedica(req, res) {
        try {
            console.log('USER ID:', req.user.id);
            console.log('BODY DATA:', req.body);

            const userId = req.user.id;

            // Extrae fecha_nacimiento y el resto de los datos
            const { fecha_nacimiento, ...otrosDatos } = req.body;

            // Formatea la fecha (si existe)
            const fechaFormateada = fecha_nacimiento
                ? new Date(fecha_nacimiento).toISOString().split('T')[0]
                : null;

            // Crea el objeto de datos usando el spread operator
            const dataParaGuardar = { ...otrosDatos, fecha_nacimiento: fechaFormateada };

            // Pasa el objeto completo al repositorio
            const result = await this.dashboardRepository.upsertInformacionMedica(userId, dataParaGuardar);

            res.json({ message: 'Información médica actualizada correctamente' });
        } catch (error) {
            console.error('Error al actualizar información médica:', error);
            res.status(500).json({ error: 'Error al actualizar información médica' });
        }
    }
}

module.exports = DashboardController;