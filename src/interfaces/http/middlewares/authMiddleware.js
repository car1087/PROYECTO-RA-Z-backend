const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  // First try Authorization header (Bearer)
  let token = null;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  if (!token) {
    console.log('Token faltante');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_temporal');
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Token expirado');
      return res.status(401).json({ error: 'Token expirado' });
    } else if (err.name === 'JsonWebTokenError') {
      console.log('Firma del token inválida');
      return res.status(401).json({ error: 'Firma del token inválida' });
    } else {
      console.log('Token inválido:', err.message);
      return res.status(401).json({ error: 'Token inválido' });
    }
  }
};