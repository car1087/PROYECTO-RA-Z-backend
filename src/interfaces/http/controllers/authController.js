const LoginUseCase = require('../../../application/auth/login');
const RegisterUseCase = require('../../../application/auth/register');
const jwt = require('jsonwebtoken');

class AuthController {
  constructor(userRepository) {
    this.loginUseCase = new LoginUseCase(userRepository);
    this.registerUseCase = new RegisterUseCase(userRepository);
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute(email, password);
      const cookieOptions = {
        httpOnly: true,
        maxAge: 24 * 3600 * 1000,
        sameSite: 'lax',
        path: '/'
      };

      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

      res.cookie('token', result.token, cookieOptions);

      const accept = (req.headers['accept'] || '').toLowerCase();
      if (accept.includes('text/html')) {
        return res.redirect('/panel.html');
      }

      res.json({ user: result.user, token: result.token });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message, error: error.message });
    }
  }

  async register(req, res) {
    try {
      const result = await this.registerUseCase.execute(req.body);

      const token = jwt.sign(
        { id: result.id, email: result.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const cookieOptions = {
        httpOnly: true,
        maxAge: 24 * 3600 * 1000,
        sameSite: 'lax',
        path: '/'
      };
      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
      res.cookie('token', token, cookieOptions);

      const accept = (req.headers['accept'] || '').toLowerCase();
      if (accept.includes('text/html')) {
        return res.redirect('/panel.html');
      }

      return res.status(201).json({ user: { id: result.id, email: result.email, fullName: result.fullName }, token });
    } catch (error) {
      const statusCode = error.message === 'El correo electrónico ya está registrado' ? 409 : 400;
      res.status(statusCode).json({ message: error.message, error: error.message });
    }
  }

  async logout(req, res) {
    res.clearCookie('token', { path: '/' });
    res.json({ ok: true });
  }
}

module.exports = AuthController;