const jwt = require('jsonwebtoken');

class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (password !== user.password_hash) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret_temporal',
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, email: user.email, fullName: user.full_name } };
  }
}

module.exports = LoginUseCase;