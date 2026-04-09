const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  let token = null;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado', error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalido o expirado', error: 'Token invalido o expirado' });
  }
};