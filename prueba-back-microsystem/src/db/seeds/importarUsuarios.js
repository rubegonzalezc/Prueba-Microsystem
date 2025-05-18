const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Usuario } = require('../models');
const { generarHashSHA256 } = require('../../utils/validation');

// Ruta al archivo CSV
const csvPath = path.join(__dirname, '../../Usuarios.csv');

async function importarUsuarios() {
  console.log('Iniciando importación de usuarios...');
  
  const usuarios = [];
  
  // Leer el archivo CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // Extraer los datos necesarios
        const usuario = {
          username: data.username,
          password: data.contraseña_no_incluir, // Usaremos esto para generar el hash
          nombres: data.nombres,
          primer_apellido: data.primer_apellido,
          segundo_apellido: data.segundo_apellido,
          fecha_nacimiento: data.fecha_nacimiento
        };
        usuarios.push(usuario);
      })
      .on('end', resolve)
      .on('error', reject);
  });
  
  console.log(`Se leyeron ${usuarios.length} usuarios del archivo CSV`);
  
  // Insertar usuarios en la base de datos
  let creados = 0;
  let errores = 0;
  
  for (const usuario of usuarios) {
    try {
      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({
        where: { username: usuario.username }
      });
      
      if (usuarioExistente) {
        console.log(`El usuario ${usuario.username} ya existe. Omitiendo...`);
        continue;
      }
      
      // Generar manualmente el hash de la contraseña
      const password_hash = generarHashSHA256(usuario.password);
      
      // Crear nuevo usuario con password_hash explícito
      await Usuario.create({
        username: usuario.username,
        password_hash: password_hash, // Asignar directamente el hash
        nombres: usuario.nombres,
        primer_apellido: usuario.primer_apellido,
        segundo_apellido: usuario.segundo_apellido,
        fecha_nacimiento: usuario.fecha_nacimiento
      });
      
      creados++;
      console.log(`Usuario ${usuario.username} creado exitosamente`);
    } catch (error) {
      errores++;
      console.error(`Error al crear el usuario ${usuario.username}:`, error.message);
    }
  }
  
  console.log('Importación finalizada');
  console.log(`Usuarios creados: ${creados}`);
  console.log(`Errores: ${errores}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  // Importar dotenv para las variables de entorno si es necesario
  require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
  
  // Ejecutar la importación y manejar la promesa
  importarUsuarios()
    .then(() => {
      console.log('Script de importación completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error en el script de importación:', error);
      process.exit(1);
    });
}

module.exports = importarUsuarios;