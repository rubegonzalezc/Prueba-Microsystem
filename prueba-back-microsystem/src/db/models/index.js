const Usuario = require('./usuario');
const ReciboPago = require('./reciboPago');
const sequelize = require('../sequelize');

// Definir relaciones
Usuario.hasMany(ReciboPago, {
  foreignKey: 'username',
  sourceKey: 'username',
  as: 'recibosPago'
});

ReciboPago.belongsTo(Usuario, {
  foreignKey: 'username',
  targetKey: 'username',
  as: 'usuario'
});

// Exportar modelos
const models = {
  Usuario,
  ReciboPago,
  sequelize
};

module.exports = models;