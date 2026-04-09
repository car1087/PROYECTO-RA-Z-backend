const express = require('express');
const AuthController = require('../controllers/authController');
const MysqlUserRepository = require('../../../infrastructure/repositories/mysqlUserRepository');
const pool = require('../../../infrastructure/database/mysql');

const router = express.Router();
const userRepository = new MysqlUserRepository();
const authController = new AuthController(userRepository);

router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

// Endpoint to get current authenticated user (reads token from cookie or Authorization header)
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/me', authMiddleware, (req, res) => {
	res.json({ user: req.user });
});

// Logout: clear cookie
router.post('/logout', (req, res) => authController.logout(req, res));

router.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, full_name FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/auth/contactos', authMiddleware, async (req, res) => {
    try {
        const { nombre, relacion, telefono } = req.body;
        const userId = req.user.id;

        const [result] = await pool.query(
            'INSERT INTO contactos_emergencia (user_id, nombre, telefono, relacion) VALUES (?, ?, ?, ?)',
            [userId, nombre, telefono, relacion]
        );

        res.status(201).json({ message: 'Contacto de emergencia creado correctamente', id: result.insertId });
    } catch (error) {
        console.error('Error al crear contacto de emergencia:', error);
        res.status(500).json({ error: 'Error al crear contacto de emergencia' });
    }
});

module.exports = router;