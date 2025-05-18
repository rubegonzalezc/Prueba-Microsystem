const { Op } = require('sequelize');
const { ReciboPago, Usuario } = require('../db/models');

/**
 * Servicio para manejar operaciones relacionadas con Recibos de Pago
 */
class ReciboPagoService {
  /**
   * Obtiene todos los recibos de pago con filtros opcionales
   * @param {Object} filtros - Filtros a aplicar
   * @returns {Promise<Array>} - Lista de recibos
   */
  async obtenerTodos(filtros = {}) {
    const { username, periodo, fechaDesde, fechaHasta, limite, pagina } = filtros;
    
    // Construir condiciones de búsqueda
    const where = {};
    
    if (username) {
      where.username = username;
    }
    
    if (periodo) {
      where.periodo = periodo;
    }
    
    if (fechaDesde || fechaHasta) {
      where.fecha_pago = {};
      
      if (fechaDesde) {
        where.fecha_pago[Op.gte] = fechaDesde;
      }
      
      if (fechaHasta) {
        where.fecha_pago[Op.lte] = fechaHasta;
      }
    }
    
    // Opciones de paginación
    const options = {
      where,
      order: [['fecha_pago', 'DESC']],
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['username', 'nombres', 'primer_apellido', 'segundo_apellido']
        }
      ]
    };
    
    // Aplicar paginación si se especifica
    if (limite && pagina) {
      options.limit = parseInt(limite);
      options.offset = (parseInt(pagina) - 1) * parseInt(limite);
    }
    
    const { count, rows } = await ReciboPago.findAndCountAll(options);
    
    return {
      total: count,
      pagina: pagina ? parseInt(pagina) : 1,
      limite: limite ? parseInt(limite) : count,
      datos: rows
    };
  }

  /**
   * Obtiene un recibo de pago por su ID
   * @param {Number} id - ID del recibo
   * @returns {Promise<Object>} - Recibo encontrado
   */
  async obtenerPorId(id) {
    const recibo = await ReciboPago.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['username', 'nombres', 'primer_apellido', 'segundo_apellido']
        }
      ]
    });
    
    if (!recibo) {
      const error = new Error('Recibo de pago no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    return recibo;
  }

  /**
   * Obtiene los recibos de pago de un usuario
   * @param {String} username - Nombre de usuario
   * @returns {Promise<Array>} - Lista de recibos
   */
  async obtenerPorUsuario(username) {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { username } });
    
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    const recibos = await ReciboPago.findAll({
      where: { username },
      order: [['fecha_pago', 'DESC']]
    });
    
    return recibos;
  }

  /**
   * Crea un nuevo recibo de pago
   * @param {Object} datos - Datos del recibo
   * @returns {Promise<Object>} - Recibo creado
   */
  async crear(datos) {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { username: datos.username } });
    
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // Crear el recibo
    const recibo = await ReciboPago.create(datos);
    return recibo;
  }

  /**
   * Actualiza un recibo existente
   * @param {Number} id - ID del recibo
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<Object>} - Recibo actualizado
   */
  async actualizar(id, datos) {
    const recibo = await ReciboPago.findByPk(id);
    
    if (!recibo) {
      const error = new Error('Recibo de pago no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // No permitir cambiar el usuario del recibo
    if (datos.username && datos.username !== recibo.username) {
      const error = new Error('No se puede cambiar el usuario del recibo');
      error.statusCode = 400;
      throw error;
    }
    
    // Actualizar el recibo
    await recibo.update(datos);
    return recibo;
  }

  /**
   * Elimina un recibo de pago
   * @param {Number} id - ID del recibo
   * @returns {Promise<Boolean>} - true si se eliminó correctamente
   */
  async eliminar(id) {
    const recibo = await ReciboPago.findByPk(id);
    
    if (!recibo) {
      const error = new Error('Recibo de pago no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    await recibo.destroy();
    return true;
  }
}

module.exports = new ReciboPagoService();