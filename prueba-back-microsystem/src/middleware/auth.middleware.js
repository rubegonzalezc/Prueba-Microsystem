const { verificarToken } = require('../utils/jwt');

/**
 * Middleware para verificar que el usuario está autenticado
 */
exports.verificarAuth = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Acceso no autorizado. Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verificarToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido o expirado'
      });
    }

    // Añadir usuario al objeto request
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Error en la autenticación'
    });
  }
};

/**
 * Middleware opcional que verifica si hay un usuario autenticado sin bloquear la solicitud
 */
exports.usuarioActual = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verificarToken(token);
      if (decoded) {
        req.usuario = decoded;
      }
    }
    next();
  } catch (error) {
    // Continuar sin error, simplemente no hay usuario autenticado
    next();
  }
};