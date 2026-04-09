const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Credenciales invalidas');
      error.statusCode = 401;
      throw error;
    }

    let passwordMatches = false;

    if (user.password_hash && user.password_hash.startsWith('$2')) {
      passwordMatches = await bcrypt.compare(password, user.password_hash);
    } else {
      passwordMatches = password === user.password_hash;
    }

    if (!passwordMatches) {
      const error = new Error('Credenciales invalidas');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, email: user.email, fullName: user.full_name } };
  }
}

module.exports = LoginUseCase;