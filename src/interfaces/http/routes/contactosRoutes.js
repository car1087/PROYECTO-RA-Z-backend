const express = require('express');
const ContactosController = require('../controllers/contactosController');
const ContactosRepository = require('../../../infrastructure/repositories/contactosRepository');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const contactosRepository = new ContactosRepository();
const contactosController = new ContactosController(contactosRepository);

router.use(authMiddleware);

router.post('/contactos', (req, res) => contactosController.createContacto(req, res));
router.get('/contactos', (req, res) => contactosController.getContactos(req, res));

module.exports = router;
