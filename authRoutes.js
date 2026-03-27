const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const MySQLUserRepository = require('../../../infrastructure/repositories/userRepository'); // Asumiendo esta ruta
const pool = require('../../../infrastructure/database/mysql'); // Asumiendo esta ruta para la conexión

// Nota: Como estás usando inyección de dependencias, aquí debes importar tu 
// repositorio de base de datos real e instanciar el controlador.
// Ejemplo:
// const MySQLUserRepository = require('../../../infrastructure/repositories/userRepository');
// const userRepository = new MySQLUserRepository();
// const authController = new AuthController(userRepository);
// --- Inyección de Dependencias ---
// 1. Creamos una instancia del repositorio que habla con la base de datos,
//    pasándole la conexión (pool).
const userRepository = new MySQLUserRepository(pool);

// 2. Creamos la instancia del controlador, ahora sí, pasándole el repositorio.
const authController = new AuthController(userRepository);

// Definición de las rutas
router.get('/test', (req, res) => res.json({ status: "ok" }));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

module.exports = router;