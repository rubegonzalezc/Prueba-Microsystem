const express = require('express');
const reciboPagoController = require('../controllers/reciboPago.controller');
const reciboPagoValidacion = require('../middleware/reciboPagoValidacion.middleware');
const { verificarAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas
// No hay rutas públicas para recibos de pago

// Rutas protegidas (requieren autenticación)
// PRIMERO las rutas específicas
// Rutas para usuarios normales
router.get('/mis-recibos',
  verificarAuth,
  reciboPagoController.obtenerMisRecibos
);

router.get('/usuario/:username',
  verificarAuth,
  reciboPagoController.obtenerPorUsuario
);

// DESPUÉS las rutas con parámetros genéricos
router.get('/:id',
  verificarAuth,
  reciboPagoController.obtenerPorId
);

// El resto de las rutas
router.get('/',
  verificarAuth,
  reciboPagoValidacion.validarFiltros,
  reciboPagoValidacion.validar,
  reciboPagoController.obtenerTodos
);

router.post('/',
  verificarAuth,
  reciboPagoValidacion.validarCrearRecibo,
  reciboPagoValidacion.validar,
  reciboPagoController.crear
);

router.put('/:id',
  verificarAuth,
  reciboPagoValidacion.validarActualizarRecibo,
  reciboPagoValidacion.validar,
  reciboPagoController.actualizar
);

router.delete('/:id',
  verificarAuth,
  reciboPagoController.eliminar
);

module.exports = router;