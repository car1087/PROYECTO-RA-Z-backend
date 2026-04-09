const bcrypt = require('bcrypt');

class RegisterUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    // Validar email único
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Validar campos requeridos
    if (!userData.email || !userData.password || !userData.fullName) {
      throw new Error('El correo, contraseña y nombre completo son requeridos');
    }

    // Validar formato de documento
    if (userData.docType && !['CC', 'TI', 'CE', 'PA'].includes(userData.docType)) {
      throw new Error('Tipo de documento inválido');
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = {
      email: userData.email,
      password_hash: passwordHash,
      fullName: userData.fullName,
      docType: userData.docType || null,
      docNumber: userData.docNumber || null,
      phone: userData.phone || null,
      roleCode: userData.roleCode || 'usuario' // Por defecto será 'usuario'
    };

    const userId = await this.userRepository.create(user);
    return {
      id: userId,
      email: user.email,
      fullName: user.fullName
    };
  }
}

module.exports = RegisterUseCase;