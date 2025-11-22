const express = require('express');
const MedicamentosController = require('../controllers/medicamentosController');
const MedicamentosRepository = require('../../../infrastructure/repositories/medicamentosRepository');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const medicamentosRepository = new MedicamentosRepository();
const medicamentosController = new MedicamentosController(medicamentosRepository);

// Proteger todas las rutas con el middleware de autenticación
router.use(authMiddleware);

// Ruta para actualizar un medicamento
router.put('/:id', authMiddleware, (req, res) => medicamentosController.updateMedicamento(req, res));

// Ruta para eliminar un medicamento
router.delete('/:id', (req, res) => medicamentosController.deleteMedicamento(req, res));

module.exports = router;