const express = require('express');
const EnfermedadesBaseController = require('../controllers/enfermedadesBaseController');
const EnfermedadesBaseRepository = require('../../../infrastructure/repositories/enfermedadesBaseRepository');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const enfermedadesBaseRepository = new EnfermedadesBaseRepository();
const enfermedadesBaseController = new EnfermedadesBaseController(enfermedadesBaseRepository);

// Proteger todas las rutas con el middleware de autenticación
router.use(authMiddleware);

// Ruta para actualizar una enfermedad
router.put('/:id', (req, res) => enfermedadesBaseController.updateEnfermedad(req, res));

// Ruta para eliminar una enfermedad
router.delete('/:id', authMiddleware, (req, res) => enfermedadesBaseController.deleteEnfermedad(req, res));

module.exports = router;