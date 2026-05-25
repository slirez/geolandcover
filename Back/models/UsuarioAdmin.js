const { DataTypes }=require('sequelize')
const sequelize = require('../conexion.js')

const UsuarioAdmin =sequelize.define('usuarios_admin', {

  id_admin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false
  },

  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },

  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  rol: {
    type: DataTypes.ENUM(
      'admin',
      'recepcionista',
      'supervisor'
    ),
    defaultValue: 'admin'
  },

  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  timestamps: false
})

module.exports = UsuarioAdmin