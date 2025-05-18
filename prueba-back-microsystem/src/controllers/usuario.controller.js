const { Usuario } = require('../db/models');
const { verificarPassword } = require('../utils/validation');
const { generarToken } = require('../utils/jwt');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password_hash'] } // Excluye campos sensibles
    });
    
    return res.status(200).json({
      exito: true,
      datos: usuarios
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    return res.status(200).json({
      exito: true,
      datos: usuario
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res, next) => {
  try {
    const { username, password, nombres, primer_apellido, segundo_apellido, fecha_nacimiento } = req.body;
    
    const nuevoUsuario = await Usuario.create({
      username,
      password, // El hook beforeCreate se encargará de hashear la contraseña
      nombres,
      primer_apellido,
      segundo_apellido,
      fecha_nacimiento
    });
    
    // No devolver password_hash en la respuesta
    const usuarioCreado = nuevoUsuario.toJSON();
    delete usuarioCreado.password_hash;
    
    return res.status(201).json({
      exito: true,
      mensaje: 'Usuario creado exitosamente',
      datos: usuarioCreado
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores: error.errors.map(err => ({
          campo: err.path,
          mensaje: err.message
        }))
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        exito: false,
        mensaje: 'El nombre de usuario ya existe'
      });
    }
    next(error);
  }
};

// Actualizar un usuario
exports.actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombres, primer_apellido, segundo_apellido, fecha_nacimiento } = req.body;
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    // Actualizar solo los campos permitidos (no username ni password)
    await usuario.update({
      nombres,
      primer_apellido,
      segundo_apellido,
      fecha_nacimiento
    });
    
    // No devolver password_hash en la respuesta
    const usuarioActualizado = usuario.toJSON();
    delete usuarioActualizado.password_hash;
    
    return res.status(200).json({
      exito: true,
      mensaje: 'Usuario actualizado exitosamente',
      datos: usuarioActualizado
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores: error.errors.map(err => ({
          campo: err.path,
          mensaje: err.message
        }))
      });
    }
    next(error);
  }
};

// Cambiar contraseña
exports.cambiarPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password_actual, password_nueva } = req.body;
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    // Verificar que la contraseña actual sea correcta
    if (!usuario.verificarPassword(password_actual)) {
      return res.status(401).json({
        exito: false,
        mensaje: 'La contraseña actual es incorrecta'
      });
    }
    
    // Actualizar la contraseña
    await usuario.update({ password: password_nueva });
    
    return res.status(200).json({
      exito: true,
      mensaje: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    await usuario.destroy();
    
    return res.status(200).json({
      exito: true,
      mensaje: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Autenticar usuario - versión con JWT
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    const usuario = await Usuario.findOne({ where: { username } });
    
    if (!usuario || !usuario.verificarPassword(password)) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      });
    }
    
    // Generar token JWT
    const token = generarToken(usuario);
    
    // No devolver password_hash en la respuesta
    const usuarioAutenticado = usuario.toJSON();
    delete usuarioAutenticado.password_hash;
    
    return res.status(200).json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso',
      datos: {
        usuario: usuarioAutenticado,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualiza el método logout en usuario.controller.js
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Importar y usar la lista negra
      const { invalidarToken } = require('../utils/tokenBlacklist');
      invalidarToken(token);
    }
    
    return res.status(200).json({
      exito: true,
      mensaje: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: 'Error al cerrar sesión'
    });
  }
};

// Método para obtener información del usuario actual autenticado
exports.obtenerUsuarioActual = async (req, res, next) => {
  try {
    const { id } = req.usuario; // Extraído del token JWT por el middleware
    
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    return res.status(200).json({
      exito: true,
      datos: usuario
    });
  } catch (error) {
    next(error);
  }
};