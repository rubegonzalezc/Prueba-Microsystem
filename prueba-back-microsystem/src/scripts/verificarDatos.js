const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Usuario } = require('../db/models');

async function verificarDatos() {
  console.log('== VERIFICANDO DATOS DE IMPORTACIÓN ==');
  
  // Rutas de archivos
  const rutaUsuarios = path.join(__dirname, '../../src/Usuarios.csv');
  const rutaRecibos = path.join(__dirname, '../../src/Recibos de Pago.csv');
  
  // Verificar existencia de archivos
  console.log('\nVerificando archivos CSV:');
  if (fs.existsSync(rutaUsuarios)) {
    console.log(`✓ Archivo de usuarios encontrado: ${rutaUsuarios}`);
  } else {
    console.log(`✗ Archivo de usuarios NO encontrado: ${rutaUsuarios}`);
  }
  
  if (fs.existsSync(rutaRecibos)) {
    console.log(`✓ Archivo de recibos encontrado: ${rutaRecibos}`);
  } else {
    console.log(`✗ Archivo de recibos NO encontrado: ${rutaRecibos}`);
  }
  
  // Leer usuarios del CSV
  const usuariosCSV = [];
  if (fs.existsSync(rutaUsuarios)) {
    await new Promise((resolve, reject) => {
      fs.createReadStream(rutaUsuarios)
        .pipe(csv())
        .on('data', (data) => usuariosCSV.push(data.username))
        .on('end', resolve)
        .on('error', reject);
    });
    console.log(`\nUsuarios encontrados en CSV: ${usuariosCSV.length}`);
  }
  
  // Leer usuarios únicos de recibos
  const usuariosRecibos = new Set();
  if (fs.existsSync(rutaRecibos)) {
    await new Promise((resolve, reject) => {
      fs.createReadStream(rutaRecibos)
        .pipe(csv())
        .on('data', (data) => {
          if (data.username && !data.username.startsWith('//')) {
            usuariosRecibos.add(data.username);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    console.log(`Usuarios referenciados en recibos: ${usuariosRecibos.size}`);
  }
  
  // Verificar consistencia
  console.log('\nVerificando consistencia de datos:');
  const usuariosRecibosArray = Array.from(usuariosRecibos);
  for (const username of usuariosRecibosArray) {
    if (!usuariosCSV.includes(username)) {
      console.log(`✗ Usuario '${username}' referenciado en recibos pero no existe en CSV de usuarios`);
    } else {
      console.log(`✓ Usuario '${username}' existe en ambos archivos CSV`);
    }
  }
  
  // Verificar usuarios en base de datos
  console.log('\nVerificando usuarios en base de datos:');
  for (const username of usuariosRecibosArray) {
    const usuarioBD = await Usuario.findOne({ where: { username } });
    if (usuarioBD) {
      console.log(`✓ Usuario '${username}' existe en la base de datos`);
    } else {
      console.log(`✗ Usuario '${username}' NO existe en la base de datos`);
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  require('dotenv').config();
  verificarDatos()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = verificarDatos;