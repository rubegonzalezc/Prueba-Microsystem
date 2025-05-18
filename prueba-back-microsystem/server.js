require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./src/db/models');
const syncDatabase = require('./src/db/sync');

const PORT = process.env.PORT || 5100;

// Iniciar el servidor
async function iniciarServidor() {
  try {
    // Sincronizar la base de datos (solo verificación, sin alterar estructura)
    await syncDatabase({ alter: false, force: false });
    
    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log(`API disponible en http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  try {
    await sequelize.close();
    console.log('Conexiones de base de datos cerradas.');
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar conexiones de base de datos:', error);
    process.exit(1);
  }
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error);
  process.exit(1);
});

// Manejo de promesas rechazadas no capturadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  // No cerramos el proceso aquí para permitir que se maneje adecuadamente
});

// Iniciar el servidor
iniciarServidor();