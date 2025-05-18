const express = require('express');
const usuarioRoutes = require('./usuario.routes');
const reciboPagoRoutes = require('./reciboPago.routes');

const router = express.Router();

// Ruta de verificación de salud
router.get('/health', (req, res) => {
  res.status(200).json({
    exito: true,
    mensaje: 'API funcionando correctamente',
    timestamp: new Date()
  });
});

// Prefijos para diferentes entidades
router.use('/usuarios', usuarioRoutes);
router.use('/recibos-pago', reciboPagoRoutes);

module.exports = router;