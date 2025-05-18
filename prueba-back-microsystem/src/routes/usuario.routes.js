const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const validacionMiddleware = require('../middleware/validacion.middleware');
const { verificarAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas
router.post('/login', 
  validacionMiddleware.validarLogin,
  validacionMiddleware.validar,
  usuarioController.login
);

router.post('/logout', usuarioController.logout);

router.post('/', 
  validacionMiddleware.validarCrearUsuario,
  validacionMiddleware.validar,
  usuarioController.crearUsuario
);

// Rutas protegidas que requieren autenticación
router.get('/me', verificarAuth, usuarioController.obtenerUsuarioActual);

router.get('/', verificarAuth, usuarioController.obtenerUsuarios);

router.get('/:id', verificarAuth, usuarioController.obtenerUsuarioPorId);

router.put('/:id', 
  verificarAuth,
  validacionMiddleware.validarActualizarUsuario,
  validacionMiddleware.validar,
  usuarioController.actualizarUsuario
);

router.patch('/:id/cambiar-password', 
  verificarAuth,
  validacionMiddleware.validarCambiarPassword,
  validacionMiddleware.validar,
  usuarioController.cambiarPassword
);

router.delete('/:id', verificarAuth, usuarioController.eliminarUsuario);

module.exports = router;