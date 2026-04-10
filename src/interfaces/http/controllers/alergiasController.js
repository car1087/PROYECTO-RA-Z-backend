class AlergiasController {
    constructor(alergiasRepository) {
        this.alergiasRepository = alergiasRepository;
    }

    async getAlergias(req, res) {
        try {
            const userId = req.user.id;
            const alergias = await this.alergiasRepository.getAlergiasByUserId(userId);
            res.json(alergias);
        } catch (error) {
            console.error('Error al obtener alergias:', error);
            res.status(500).json({ error: 'Error al obtener alergias' });
        }
    }

    async createAlergia(req, res) {
        try {
            const userId = req.user.id;
            const tipo_alergia = req.body.tipo_alergia || req.body.tipo || req.body.categoria || null;
            const severidad_reaccion = req.body.severidad_reaccion || req.body.severidad || null;
            const sustancia = req.body.sustancia || req.body.alergeno || req.body.nombre || null;
            const observaciones = req.body.observaciones || req.body.notas || req.body.descripcion || null;

            if (!tipo_alergia || !severidad_reaccion || !sustancia) {
                return res.status(400).json({
                    error: 'Tipo de alergia, severidad y sustancia son requeridos',
                    received: Object.keys(req.body)
                });
            }

            const result = await this.alergiasRepository.createAlergia(userId, {
                tipo_alergia,
                severidad_reaccion,
                sustancia,
                observaciones
            });
            res.status(201).json({ message: 'Alergia creada correctamente', id: result.insertId });
        } catch (error) {
            console.error('Error al crear alergia:', error);
            res.status(500).json({ message: 'Error al crear alergia', error: 'Error al crear alergia', code: error.code || null, detail: error.message || null });
        }
    }

    async updateAlergia(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const tipo_alergia = req.body.tipo_alergia || req.body.tipo || req.body.categoria || null;
            const severidad_reaccion = req.body.severidad_reaccion || req.body.severidad || null;
            const sustancia = req.body.sustancia || req.body.alergeno || req.body.nombre || null;
            const observaciones = req.body.observaciones || req.body.notas || req.body.descripcion || null;

            if (!tipo_alergia || !severidad_reaccion || !sustancia) {
                return res.status(400).json({
                    error: 'Tipo de alergia, severidad y sustancia son requeridos',
                    received: Object.keys(req.body)
                });
            }

            const result = await this.alergiasRepository.updateAlergia(id, userId, {
                tipo_alergia,
                severidad_reaccion,
                sustancia,
                observaciones
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Alergia no encontrada' });
            }

            res.json({ message: 'Alergia actualizada correctamente' });
        } catch (error) {
            console.error('Error al actualizar alergia:', error);
            res.status(500).json({ message: 'Error al actualizar alergia', error: 'Error al actualizar alergia', code: error.code || null, detail: error.message || null });
        }
    }

    async deleteAlergia(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const result = await this.alergiasRepository.deleteAlergia(id, userId);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Alergia no encontrada' });
            }

            res.json({ message: 'Alergia eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar alergia:', error);
            res.status(500).json({ error: 'Error al eliminar alergia' });
        }
    }
}

module.exports = AlergiasController;