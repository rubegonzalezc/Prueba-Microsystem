const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { ReciboPago, Usuario } = require('../models');

// Ruta al archivo CSV
const csvPath = path.join(__dirname, '../../Recibos de Pago.csv');

async function importarRecibosPago() {
  console.log('Iniciando importación de recibos de pago...');
  
  const recibos = [];
  
  // Leer el archivo CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // Solo procesar filas que no comienzan con '//'
        if (!data.username || !data.username.startsWith('//')) {
          // Extraer los datos necesarios
          const recibo = {
            username: data.username,
            nro_recibo: data.nro_recibo,
            fecha_pago: data.fecha_pago,
            periodo: data.periodo,
            sueldo_base: parseInt(data.sueldo_base),
            bono_produccion: parseInt(data.bono_produccion),
            descuento_salud: parseInt(data.descuento_salud),
            descuento_afp: parseInt(data.descuento_afp),
            otros_descuentos: parseInt(data.otros_descuentos),
            sueldo_liquido: parseInt(data.sueldo_liquido),
            detalle: data.detalle
          };
          recibos.push(recibo);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });
  
  console.log(`Se leyeron ${recibos.length} recibos de pago del archivo CSV`);
  
  // Obtener nombres de usuario únicos
  const usernames = [...new Set(recibos.map(r => r.username))];
  
  // Verificar que existan todos los usuarios
  const usuariosExistentes = await Usuario.findAll({
    where: { username: usernames }
  });
  
  const usuariosExistentesMap = new Map();
  usuariosExistentes.forEach(u => usuariosExistentesMap.set(u.username, true));
  
  const usuariosNoExistentes = usernames.filter(u => !usuariosExistentesMap.has(u));
  
  if (usuariosNoExistentes.length > 0) {
    console.warn('ADVERTENCIA: Los siguientes usuarios no existen y sus recibos no serán importados:');
    usuariosNoExistentes.forEach(u => console.warn(`- ${u}`));
  }
  
  // Insertar recibos en la base de datos
  let creados = 0;
  let errores = 0;
  
  for (const recibo of recibos) {
    try {
      // Verificar si el usuario existe
      if (!usuariosExistentesMap.has(recibo.username)) {
        console.log(`Omitiendo recibo de ${recibo.username} (usuario no existe)`);
        continue;
      }
      
      // Verificar si el recibo ya existe
      const reciboExistente = await ReciboPago.findOne({
        where: { 
          username: recibo.username,
          nro_recibo: recibo.nro_recibo
        }
      });
      
      if (reciboExistente) {
        console.log(`El recibo ${recibo.nro_recibo} para ${recibo.username} ya existe. Omitiendo...`);
        continue;
      }
      
      // Crear el recibo
      await ReciboPago.create(recibo);
      
      creados++;
      console.log(`Recibo ${recibo.nro_recibo} para ${recibo.username} creado exitosamente`);
    } catch (error) {
      errores++;
      console.error(`Error al crear el recibo ${recibo.nro_recibo} para ${recibo.username}:`, error.message);
    }
  }
  
  console.log('Importación finalizada');
  console.log(`Recibos creados: ${creados}`);
  console.log(`Errores: ${errores}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  // Importar dotenv para las variables de entorno si es necesario
  require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
  
  // Ejecutar la importación y manejar la promesa
  importarRecibosPago()
    .then(() => {
      console.log('Script de importación completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error en el script de importación:', error);
      process.exit(1);
    });
}

module.exports = importarRecibosPago;