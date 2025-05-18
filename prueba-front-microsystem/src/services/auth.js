import axios from 'axios';

// Configuración base de axios
const API_URL = 'http://localhost:5100/api/v1';

export const authService = {
  /**
   * Inicia sesión del usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise} - Promesa con respuesta del servidor
   */
  async login (username, password) {
    try {
      console.log('Intentando login con:', { username, password: '***' });
      const response = await axios.post(`${API_URL}/usuarios/login`, {
        username,
        password,
      });

      // Ver la estructura completa de la respuesta
      console.log('Respuesta completa del servidor:', JSON.stringify(response.data, null, 2));

      // Modificación aquí: usar datos en lugar de data
      if (response.data.datos && response.data.datos.token) {
        // Guardar token en localStorage y agregar console.log para depuración
        localStorage.setItem('auth-token', response.data.datos.token);
        localStorage.setItem('user-info', JSON.stringify(response.data.datos.usuario));
        console.log('Token guardado:', response.data.datos.token.substring(0, 20) + '...');
      } else {
        console.error('No se encontró token en la respuesta:', response.data);
      }

      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      // Propagar el error para manejarlo en el componente
      throw error?.response?.data || { error: 'Error de conexión', message: 'No se pudo conectar con el servidor' };
    }
  },

  /**
   * Cierra la sesión del usuario
   */
  logout () {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-info');
    console.log('Sesión cerrada');
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} - true si está autenticado
   */
  isAuthenticated () {
    const token = localStorage.getItem('auth-token');
    const isValid = !!token;
    console.log('Estado de autenticación:', isValid);
    return isValid;
  },
  
  /**
   * Obtiene la información del usuario actual
   * @returns {Object|null} - Datos del usuario o null
   */
  getCurrentUser () {
    const userInfo = localStorage.getItem('user-info');
    return userInfo ? JSON.parse(userInfo) : null;
  },
  
  /**
   * Obtiene el token de autenticación almacenado
   * @returns {string|null} - Token de autenticación o null
   */
  getToken () {
    return localStorage.getItem('auth-token');
  }
};
