// Middleware para manejar errores generales
exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Determinamos el código de estado HTTP
  const statusCode = err.statusCode || 500;
  
  // Enviamos la respuesta de error
  res.status(statusCode).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
    // Solo incluir stack trace en ambiente de desarrollo
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para rutas no encontradas
exports.notFoundHandler = (req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada'
  });
};