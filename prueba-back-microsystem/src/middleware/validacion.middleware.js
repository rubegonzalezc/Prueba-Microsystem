const { body, param, validationResult } = require('express-validator');
const { validarUsername } = require('../utils/validation');

// Middleware para verificar errores de validación
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

// Reglas de validación para crear usuario
exports.validarCrearUsuario = [
  body('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .custom(value => {
      if (!validarUsername(value)) {
        throw new Error(
          'El nombre de usuario debe estar en formato UpperCamelCase, ' +
          'tener al menos 15 caracteres, comenzar con una letra y terminar con 3 dígitos'
        );
      }
      return true;
    }),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombres')
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('primer_apellido')
    .notEmpty().withMessage('El primer apellido es obligatorio'),
  body('fecha_nacimiento')
    .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
    .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
];

// Reglas de validación para actualizar usuario
exports.validarActualizarUsuario = [
  param('id')
    .isInt().withMessage('El ID debe ser un número entero'),
  body('nombres')
    .optional()
    .notEmpty().withMessage('El nombre no puede estar vacío'),
  body('primer_apellido')
    .optional()
    .notEmpty().withMessage('El primer apellido no puede estar vacío'),
  body('fecha_nacimiento')
    .optional()
    .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
];

// Reglas de validación para cambiar contraseña
exports.validarCambiarPassword = [
  param('id')
    .isInt().withMessage('El ID debe ser un número entero'),
  body('password_actual')
    .notEmpty().withMessage('La contraseña actual es obligatoria'),
  body('password_nueva')
    .notEmpty().withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .custom((value, { req }) => {
      if (value === req.body.password_actual) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }
      return true;
    }),
];

// Reglas de validación para login
exports.validarLogin = [
  body('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];