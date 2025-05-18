const jwt = require('jsonwebtoken');

// Secreto para firmar los tokens - debería estar en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Genera un token JWT para un usuario
 * @param {Object} usuario - Datos del usuario para incluir en el payload
 * @returns {String} Token JWT
 */
exports.generarToken = (usuario) => {
  const payload = {
    id: usuario.id,
    username: usuario.username
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verifica y decodifica un token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object} Payload decodificado o null si es inválido
 */
exports.verificarToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};