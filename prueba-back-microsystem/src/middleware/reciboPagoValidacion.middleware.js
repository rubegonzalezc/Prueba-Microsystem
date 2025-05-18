const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para verificar errores de validación
 */
exports.validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      exito: false,
      errores: errores.array()
    });
  }
  next();
};

/**
 * Validaciones para crear un recibo de pago
 */
exports.validarCrearRecibo = [
  body('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio'),
  
  body('nro_recibo')
    .notEmpty().withMessage('El número de recibo es obligatorio'),
  
  body('fecha_pago')
    .notEmpty().withMessage('La fecha de pago es obligatoria')
    .isDate().withMessage('La fecha debe tener formato YYYY-MM-DD'),
  
  body('periodo')
    .notEmpty().withMessage('El periodo es obligatorio'),
  
  body('sueldo_base')
    .notEmpty().withMessage('El sueldo base es obligatorio')
    .isInt({ min: 0 }).withMessage('El sueldo base debe ser un número entero positivo'),
  
  body('bono_produccion')
    .optional()
    .isInt({ min: 0 }).withMessage('El bono de producción debe ser un número entero positivo'),
  
  body('descuento_salud')
    .optional()
    .isInt({ min: 0 }).withMessage('El descuento de salud debe ser un número entero positivo'),
  
  body('descuento_afp')
    .optional()
    .isInt({ min: 0 }).withMessage('El descuento de AFP debe ser un número entero positivo'),
  
  body('otros_descuentos')
    .optional()
    .isInt({ min: 0 }).withMessage('Otros descuentos debe ser un número entero positivo'),
  
  body('sueldo_liquido')
    .notEmpty().withMessage('El sueldo líquido es obligatorio')
    .isInt({ min: 0 }).withMessage('El sueldo líquido debe ser un número entero positivo'),
];

/**
 * Validaciones para actualizar un recibo de pago
 */
exports.validarActualizarRecibo = [
  param('id')
    .isInt().withMessage('El ID debe ser un número entero'),
  
  body('fecha_pago')
    .optional()
    .isDate().withMessage('La fecha debe tener formato YYYY-MM-DD'),
  
  body('sueldo_base')
    .optional()
    .isInt({ min: 0 }).withMessage('El sueldo base debe ser un número entero positivo'),
  
  body('bono_produccion')
    .optional()
    .isInt({ min: 0 }).withMessage('El bono de producción debe ser un número entero positivo'),
  
  body('descuento_salud')
    .optional()
    .isInt({ min: 0 }).withMessage('El descuento de salud debe ser un número entero positivo'),
  
  body('descuento_afp')
    .optional()
    .isInt({ min: 0 }).withMessage('El descuento de AFP debe ser un número entero positivo'),
  
  body('otros_descuentos')
    .optional()
    .isInt({ min: 0 }).withMessage('Otros descuentos debe ser un número entero positivo'),
  
  body('sueldo_liquido')
    .optional()
    .isInt({ min: 0 }).withMessage('El sueldo líquido debe ser un número entero positivo'),
];

/**
 * Validaciones para filtros de búsqueda
 */
exports.validarFiltros = [
  query('fechaDesde')
    .optional()
    .isDate().withMessage('La fecha desde debe tener formato YYYY-MM-DD'),
  
  query('fechaHasta')
    .optional()
    .isDate().withMessage('La fecha hasta debe tener formato YYYY-MM-DD'),
  
  query('limite')
    .optional()
    .isInt({ min: 1 }).withMessage('El límite debe ser un número entero positivo'),
  
  query('pagina')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número entero positivo'),
];