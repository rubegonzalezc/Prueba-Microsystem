const reciboPagoService = require('../services/reciboPago.service');

/**
 * Obtener todos los recibos de pago con filtros opcionales
 */
exports.obtenerTodos = async (req, res, next) => {
  try {
    const { username, periodo, fechaDesde, fechaHasta, limite, pagina } = req.query;
    
    const resultado = await reciboPagoService.obtenerTodos({
      username,
      periodo,
      fechaDesde,
      fechaHasta,
      limite,
      pagina
    });
    
    return res.status(200).json({
      exito: true,
      ...resultado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un recibo de pago por su ID
 */
exports.obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const recibo = await reciboPagoService.obtenerPorId(id);
    
    return res.status(200).json({
      exito: true,
      datos: recibo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener los recibos de un usuario específico
 */
exports.obtenerPorUsuario = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const recibos = await reciboPagoService.obtenerPorUsuario(username);
    
    return res.status(200).json({
      exito: true,
      datos: recibos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener los recibos del usuario autenticado
 */
exports.obtenerMisRecibos = async (req, res, next) => {
  try {
    // req.usuario viene del middleware de autenticación
    const username = req.usuario.username;
    
    const recibos = await reciboPagoService.obtenerPorUsuario(username);
    
    return res.status(200).json({
      exito: true,
      datos: recibos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo recibo de pago
 */
exports.crear = async (req, res, next) => {
  try {
    const nuevoRecibo = await reciboPagoService.crear(req.body);
    
    return res.status(201).json({
      exito: true,
      mensaje: 'Recibo de pago creado exitosamente',
      datos: nuevoRecibo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un recibo de pago
 */
exports.actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const reciboActualizado = await reciboPagoService.actualizar(id, req.body);
    
    return res.status(200).json({
      exito: true,
      mensaje: 'Recibo de pago actualizado exitosamente',
      datos: reciboActualizado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un recibo de pago
 */
exports.eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await reciboPagoService.eliminar(id);
    
    return res.status(200).json({
      exito: true,
      mensaje: 'Recibo de pago eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};