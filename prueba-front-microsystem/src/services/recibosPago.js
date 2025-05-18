import axios from 'axios';
import { authService } from './auth';

const API_URL = 'http://localhost:5100/api/v1';

export const recibosPagoService = {
  /**
   * Obtiene todos los recibos de pago del usuario autenticado
   * @returns {Promise} - Promesa con la respuesta
   */
  async obtenerMisRecibos() {
    const token = authService.getToken();
    return axios.get(`${API_URL}/recibos-pago/mis-recibos`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data.datos);
  },

  /**
   * Obtiene un recibo de pago específico por su ID
   * @param {number|string} id - ID del recibo
   * @returns {Promise} - Promesa con la respuesta
   */
  async obtenerPorId(id) {
    const token = authService.getToken();
    return axios.get(`${API_URL}/recibos-pago/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data.datos);
  },

  /**
   * Obtiene los recibos paginados con filtros opcionales
   * @param {Object} filtros - Filtros a aplicar
   * @returns {Promise} - Promesa con la respuesta
   */
  async obtenerTodos(filtros = {}) {
    const token = authService.getToken();
    const params = new URLSearchParams();
    
    // Agregar filtros a los parámetros de consulta
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) params.append(key, filtros[key]);
    });
    
    return axios.get(`${API_URL}/recibos-pago?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data);
  },

  /**
   * Formatea la fecha para mostrar en el dashboard
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {string} - Fecha formateada
   */
  formatearFecha(fecha) {
    if (!fecha) return '';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  },

  /**
   * Formatea un valor monetario
   * @param {number} valor - Monto a formatear
   * @returns {string} - Monto formateado como moneda
   */
  formatearMoneda(valor) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  }
};