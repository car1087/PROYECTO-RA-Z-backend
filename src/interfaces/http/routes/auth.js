const express = require('express');
const AuthController = require('../controllers/authController');
const MysqlUserRepository = require('../../../infrastructure/repositories/mysqlUserRepository');

const router = express.Router();
const userRepository = new MysqlUserRepository();
const authController = new AuthController(userRepository);

router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

// Endpoint to get current authenticated user (reads token from cookie or Authorization header)
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/me', authMiddleware, async (req, res) => {
	try {
		const user = await userRepository.findById(req.user.id);
		res.json({ user });
	} catch (error) {
		res.status(500).json({ error: 'Error fetching user' });
	}
});

// Logout: clear cookie
router.post('/logout', (req, res) => authController.logout(req, res));

module.exports = router;