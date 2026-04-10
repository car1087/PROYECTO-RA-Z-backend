class MedicamentosController {
    constructor(medicamentosRepository) {
        this.medicamentosRepository = medicamentosRepository;
    }

    async getMedicamentos(req, res) {
        try {
            const userId = req.user.id;
            const medicamentos = await this.medicamentosRepository.getMedicamentosByUserId(userId);
            res.json(medicamentos);
        } catch (error) {
            console.error('Error al obtener medicamentos:', error);
            res.status(500).json({ error: 'Error al obtener medicamentos' });
        }
    }

    async createMedicamento(req, res) {
        console.log('--- REQ.BODY RECIBIDO EN MEDICAMENTOS ---');
        console.log(req.body);
        try {
            const userId = req.user.id;
            const { nombre_medicamento, dosis, via_administracion } = req.body;
            const cantidad_dosis = req.body.cantidad_dosis ?? req.body.cantidad_dosis_dia ?? null;

            if (!nombre_medicamento || !dosis || !via_administracion) {
                return res.status(400).json({ error: 'nombre_medicamento, dosis y via_administracion son requeridos' });
            }

            const result = await this.medicamentosRepository.createMedicamento(userId, {
                nombre_medicamento,
                dosis,
                via_administracion,
                cantidad_dosis,
                cantidad_dosis_dia: cantidad_dosis
            });

            res.status(201).json({ message: 'Medicamento creado correctamente', id: result.insertId });
        } catch (error) {
            console.error('Error al crear medicamento:', error);
            res.status(500).json({ message: 'Error al crear medicamento', error: 'Error al crear medicamento', code: error.code || null, detail: error.message || null });
        }
    }

    async updateMedicamento(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { nombre_medicamento, dosis, via_administracion } = req.body;
            const cantidad_dosis = req.body.cantidad_dosis ?? req.body.cantidad_dosis_dia ?? null;

            if (!nombre_medicamento || !dosis || !via_administracion) {
                return res.status(400).json({ error: 'nombre_medicamento, dosis y via_administracion son requeridos' });
            }

            const result = await this.medicamentosRepository.updateMedicamento(id, userId, {
                nombre_medicamento,
                dosis,
                via_administracion,
                cantidad_dosis,
                cantidad_dosis_dia: cantidad_dosis
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Medicamento no encontrado' });
            }

            res.json({ message: 'Medicamento actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar medicamento:', error);
            res.status(500).json({ error: 'Error al actualizar medicamento' });
        }
    }

    async deleteMedicamento(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const result = await this.medicamentosRepository.deleteMedicamento(id, userId);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Medicamento no encontrado' });
            }

            res.json({ message: 'Medicamento eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar medicamento:', error);
            res.status(500).json({ error: 'Error al eliminar medicamento' });
        }
    }
}

module.exports = MedicamentosController;