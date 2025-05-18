const { sequelize } = require('./models');

// Sincronización básica para el arranque normal del servidor
async function syncDatabase(options = {}) {
  try {
    // Por defecto, no alteramos tablas en desarrollo/producción - solo verificamos
    const syncOptions = {
      // No modificar las tablas existentes por defecto
      alter: false,
      // No forzar recreación de tablas por defecto
      force: false,
      // Permitir sobrescribir con opciones personalizadas
      ...options
    };
    
    console.log(`Sincronizando base de datos con opciones: ${JSON.stringify(syncOptions)}`);
    await sequelize.sync(syncOptions);
    console.log('Base de datos sincronizada correctamente');
    return true;
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    throw error;
  }
}

module.exports = syncDatabase;