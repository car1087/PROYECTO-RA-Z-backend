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
      // Set token as an httpOnly cookie so browser will send it automatically on subsequent requests
      const cookieOptions = {
        httpOnly: true,
        maxAge: 24 * 3600 * 1000,
        sameSite: 'lax',
        path: '/'
      };
      // In production, mark secure
      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

      res.cookie('token', result.token, cookieOptions);

      // If the client expects HTML (browser form submit), redirect to the panel
      const accept = (req.headers['accept'] || '').toLowerCase();
      if (accept.includes('text/html')) {
        return res.redirect('/panel.html');
      }

      // Default: return user info and token for frontend to store
      res.json({ success: true, token: result.token, user: { id: result.user.id, fullName: result.user.fullName } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async register(req, res) {
    try {
      const result = await this.registerUseCase.execute(req.body);

      // Create JWT for the newly created user
      const token = jwt.sign(
        { id: result.id, email: result.email },
        process.env.JWT_SECRET || 'default_secret_temporal',
        { expiresIn: '24h' }
      );

      // Set cookie
      const cookieOptions = {
        httpOnly: true,
        maxAge: 24 * 3600 * 1000,
        sameSite: 'lax',
        path: '/'
      };
      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
      res.cookie('token', token, cookieOptions);

      // If browser expects HTML, redirect
      const accept = (req.headers['accept'] || '').toLowerCase();
      if (accept.includes('text/html')) {
        return res.redirect('/panel.html');
      }

      // Return created user info and token
      return res.status(201).json({ user: { id: result.id, email: result.email, fullName: result.fullName }, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req, res) {
    // Clear the token cookie
    res.clearCookie('token', { path: '/' });
    res.json({ ok: true });
  }
}

module.exports = AuthController;