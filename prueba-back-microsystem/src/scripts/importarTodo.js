const path = require('path');
const fs = require('fs');
const { sequelize } = require('../db/models');
const importarUsuarios = require('../db/seeds/importarUsuarios');
const importarRecibosPago = require('../db/seeds/importarRecibosPago');

// Función para verificar si un archivo existe
const archivoExiste = (ruta) => {
  try {
    return fs.existsSync(ruta);
  } catch (error) {
    console.error(`Error verificando archivo ${ruta}:`, error);
    return false;
  }
};

// Función para confirmar eliminación (simula una confirmación)
const confirmarEliminacion = async () => {
  console.log('ADVERTENCIA: Esta operación eliminará todas las tablas existentes y sus datos.');
  console.log('Continuando en 3 segundos...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  return true;
};

async function importarTodo() {
  console.log('== INICIANDO PROCESO DE IMPORTACIÓN ==');
  
  // Verificar archivos CSV
  const rutaUsuarios = path.join(__dirname, '../../src/Usuarios.csv');
  const rutaRecibos = path.join(__dirname, '../../src/Recibos de Pago.csv');
  
  console.log('Verificando archivos CSV...');
  const existeUsuarios = archivoExiste(rutaUsuarios);
  const existeRecibos = archivoExiste(rutaRecibos);
  
  if (!existeUsuarios || !existeRecibos) {
    console.error('ERROR: No se encontraron los archivos CSV necesarios.');
    process.exit(1);
  }
  
  console.log('✓ Archivos CSV verificados correctamente');
  
  // Confirmar eliminación de datos
  await confirmarEliminacion();
  
  try {
    // 1. Eliminar y recrear todas las tablas
    console.log('\n== RECREANDO BASE DE DATOS ==');
    // force: true elimina todas las tablas existentes y las recrea
    await sequelize.sync({ force: true });
    console.log('✓ Base de datos recreada correctamente');
    
    // 2. Importar usuarios primero (requisito para recibos)
    console.log('\n== IMPORTANDO USUARIOS ==');
    await importarUsuarios();
    
    // 3. Importar recibos de pago después
    console.log('\n== IMPORTANDO RECIBOS DE PAGO ==');
    await importarRecibosPago();
    
    console.log('\n== IMPORTACIÓN COMPLETADA EXITOSAMENTE ==');
  } catch (error) {
    console.error('\nERROR EN EL PROCESO DE IMPORTACIÓN:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  require('dotenv').config();
  importarTodo()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = importarTodo;