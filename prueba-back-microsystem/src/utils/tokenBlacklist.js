// Lista negra de tokens (en memoria - para producción usa Redis)
const tokenBlacklist = new Set();

/**
 * Añade un token a la lista negra
 * @param {String} token - Token a invalidar
 */
exports.invalidarToken = (token) => {
  tokenBlacklist.add(token);
};

/**
 * Verifica si un token está en la lista negra
 * @param {String} token - Token a verificar
 * @returns {Boolean} true si está en la lista negra
 */
exports.estaEnListaNegra = (token) => {
  return tokenBlacklist.has(token);
};

// Limpieza periódica de la lista negra
// Esto es un ejemplo simple, en producción necesitarías
// una estrategia más robusta
setInterval(() => {
  // Esta es una simplificación, deberías verificar expiración del token
  console.log(`Limpiando lista negra de tokens. Tamaño: ${tokenBlacklist.size}`);
  // tokenBlacklist.clear(); // No recomendado en producción
}, 24 * 60 * 60 * 1000); // Limpieza diaria