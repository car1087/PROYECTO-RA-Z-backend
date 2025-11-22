const express = require('express');
const AlergiasController = require('../controllers/alergiasController');
const AlergiasRepository = require('../../../infrastructure/repositories/alergiasRepository');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const alergiasRepository = new AlergiasRepository();
const alergiasController = new AlergiasController(alergiasRepository);

// Proteger todas las rutas con el middleware de autenticación
router.use(authMiddleware);

// Ruta para actualizar una alergia
router.put('/:id', (req, res) => alergiasController.updateAlergia(req, res));

// Ruta para eliminar una alergia
router.delete('/:id', (req, res) => alergiasController.deleteAlergia(req, res));

module.exports = router;