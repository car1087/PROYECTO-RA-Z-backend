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
            const { nombre_medicamento, dosis, via_administracion, cantidad_dosis_dia } = req.body;

            console.log('--- VALORES DE CAMPOS ---');
            console.log('nombre_medicamento:', nombre_medicamento);
            console.log('dosis:', dosis);
            console.log('via_administracion:', via_administracion);
            console.log('cantidad_dosis_dia:', cantidad_dosis_dia);

            // Validaciones básicas
            if (!nombre_medicamento || !dosis || !via_administracion || !cantidad_dosis_dia) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            const result = await this.medicamentosRepository.createMedicamento(userId, {
                nombre_medicamento,
                dosis,
                via_administracion,
                cantidad_dosis_dia
            });

            res.status(201).json({ message: 'Medicamento creado correctamente', id: result.insertId });
        } catch (error) {
            console.error('--- ERROR AL CREAR MEDICAMENTO ---');
            console.error(error); // Imprime el error completo
            res.status(400).json({ error: 'Error al procesar la solicitud', message: error.message });
        }
    }

    async updateMedicamento(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { nombre_medicamento, dosis, via_administracion, cantidad_dosis_dia } = req.body;

            // Validaciones básicas
            if (!nombre_medicamento || !dosis || !via_administracion || !cantidad_dosis_dia) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            const result = await this.medicamentosRepository.updateMedicamento(id, userId, {
                nombre_medicamento,
                dosis,
                via_administracion,
                cantidad_dosis_dia
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Medicamento no encontrado' });
            }

            res.status(200).json({ message: 'Medicamento actualizado' });
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

            res.status(200).json({ message: 'Medicamento eliminado' });
        } catch (error) {
            console.error('Error al eliminar medicamento:', error);
            res.status(500).json({ error: 'Error al eliminar medicamento' });
        }
    }
}

module.exports = MedicamentosController;