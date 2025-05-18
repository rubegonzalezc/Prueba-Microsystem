const crypto = require('crypto');

/**
 * Valida el formato del nombre de usuario:
 * - Formato UpperCamelCase
 * - Longitud mínima: 15 caracteres
 * - Comienza con una letra
 * - Termina con 3 dígitos numéricos
 */
exports.validarUsername = (username) => {
  // Expresión regular para validar el formato requerido
  // ^ - inicio de línea
  // [A-Z] - primera letra mayúscula
  // [a-zA-Z]+ - seguida de una o más letras
  // .{10,} - seguido de al menos 10 caracteres más (para cumplir con mínimo 15 en total)
  // \d{3} - termina con exactamente 3 dígitos
  // $ - fin de línea
  const regex = /^[A-Z][a-zA-Z]+.{10,}\d{3}$/;
  
  return regex.test(username);
};

/**
 * Genera un hash SHA-256 para una contraseña
 */
exports.generarHashSHA256 = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Verifica si una contraseña coincide con un hash almacenado
 */
exports.verificarPassword = (password, storedHash) => {
  const hash = exports.generarHashSHA256(password);
  return hash === storedHash;
};