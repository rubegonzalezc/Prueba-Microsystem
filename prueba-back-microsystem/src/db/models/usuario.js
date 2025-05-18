const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const { validarUsername, generarHashSHA256 } = require('../../utils/validation');

class Usuario extends Model {
  // Método para verificar contraseña
  verificarPassword(password) {
    const hash = generarHashSHA256(password);
    return hash === this.password_hash;
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este nombre de usuario ya está en uso'
      },
      validate: {
        notNull: {
          msg: 'El nombre de usuario es obligatorio'
        },
        notEmpty: {
          msg: 'El nombre de usuario no puede estar vacío'
        },
        customValidator(value) {
          if (!validarUsername(value)) {
            throw new Error(
              'El nombre de usuario debe estar en formato UpperCamelCase, ' +
              'tener al menos 15 caracteres, comenzar con una letra y terminar con 3 dígitos'
            );
          }
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Los nombres son obligatorios'
        },
        notEmpty: {
          msg: 'Los nombres no pueden estar vacíos'
        }
      }
    },
    primer_apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El primer apellido es obligatorio'
        },
        notEmpty: {
          msg: 'El primer apellido no puede estar vacío'
        }
      }
    },
    segundo_apellido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La fecha de nacimiento es obligatoria'
        },
        isDate: {
          msg: 'La fecha de nacimiento debe ser una fecha válida'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
      beforeCreate: (usuario) => {
        if (usuario.password) {
          usuario.password_hash = generarHashSHA256(usuario.password);
          delete usuario.password;
        }
      },
      beforeUpdate: (usuario) => {
        if (usuario.password) {
          usuario.password_hash = generarHashSHA256(usuario.password);
          delete usuario.password;
        }
      }
    }
  }
);

module.exports = Usuario;