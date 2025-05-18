const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class ReciboPago extends Model {}

ReciboPago.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'usuarios', // Nombre de la tabla, no del modelo
        key: 'username'    // Campo referenciado
      }
    },
    nro_recibo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'El número de recibo es obligatorio' },
        notEmpty: { msg: 'El número de recibo no puede estar vacío' }
      }
    },
    fecha_pago: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'La fecha de pago debe ser una fecha válida' },
        notNull: { msg: 'La fecha de pago es obligatoria' }
      }
    },
    periodo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'El periodo es obligatorio' },
        notEmpty: { msg: 'El periodo no puede estar vacío' }
      }
    },
    sueldo_base: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'El sueldo base debe ser un número entero' },
        min: { args: [0], msg: 'El sueldo base no puede ser negativo' }
      }
    },
    bono_produccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'El bono de producción debe ser un número entero' },
        min: { args: [0], msg: 'El bono de producción no puede ser negativo' }
      }
    },
    descuento_salud: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'El descuento de salud debe ser un número entero' },
        min: { args: [0], msg: 'El descuento de salud no puede ser negativo' }
      }
    },
    descuento_afp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'El descuento de AFP debe ser un número entero' },
        min: { args: [0], msg: 'El descuento de AFP no puede ser negativo' }
      }
    },
    otros_descuentos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'Otros descuentos debe ser un número entero' },
        min: { args: [0], msg: 'Otros descuentos no puede ser negativo' }
      }
    },
    sueldo_liquido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'El sueldo líquido debe ser un número entero' },
        min: { args: [0], msg: 'El sueldo líquido no puede ser negativo' }
      }
    },
    detalle: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'ReciboPago',
    tableName: 'recibos_pago',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  }
);

module.exports = ReciboPago;