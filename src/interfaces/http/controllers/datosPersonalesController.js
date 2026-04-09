class DatosPersonalesController {
    constructor(datosPersonalesRepository) {
        this.datosPersonalesRepository = datosPersonalesRepository;
    }

    async getDatosPersonales(req, res) {
        try {
            const userId = req.user.id;
            const datos = await this.datosPersonalesRepository.getDatosPersonales(userId);

            if (!datos) {
                return res.json({
                    nombre_completo: null,
                    tipo_documento: null,
                    numero_documento: null,
                    fecha_nacimiento: null,
                    grupo_sanguineo: null,
                    numero_telefono: null
                });
            }

            res.json(datos);
        } catch (error) {
            console.error('Error al obtener datos personales:', error);
            res.status(500).json({ error: 'Error al obtener datos personales' });
        }
    }

    async saveDatosPersonales(req, res) {
        try {
            const userId = req.user.id;
            const { nombre_completo, tipo_documento, numero_documento, fecha_nacimiento, grupo_sanguineo, numero_telefono } = req.body;

            // Validaciones básicas
            if (!nombre_completo || !tipo_documento || !numero_documento || !fecha_nacimiento || !grupo_sanguineo || !numero_telefono) {
                return res.status(400).json({ message: 'Todos los campos son requeridos', error: 'Todos los campos son requeridos' });
            }

            const result = await this.datosPersonalesRepository.saveDatosPersonales(userId, {
                nombre_completo,
                tipo_documento,
                numero_documento,
                fecha_nacimiento,
                grupo_sanguineo,
                numero_telefono
            });

            res.json({ message: 'Datos personales guardados correctamente' });
        } catch (error) {
            console.error('Error al guardar datos personales:', error);
            res.status(500).json({
                message: 'Error al guardar datos personales',
                error: 'Error al guardar datos personales',
                code: error.code || null,
                detail: error.message || null
            });
        }
    }
}

module.exports = DatosPersonalesController;