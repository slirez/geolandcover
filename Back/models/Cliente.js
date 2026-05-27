const { DataTypes }=require('sequelize')
const sequelize = require('../conexion.js')

const Cliente = sequelize.define('clientes', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre_completo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  password_hash:{
  type: DataTypes.STRING(255),
  allowNull: false
  },

  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },

  direccion: {
    type: DataTypes.TEXT
  },

  empresa: {
    type: DataTypes.STRING(150)
  },

  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  timestamps: false
})

module.exports = Cliente;