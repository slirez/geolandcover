const { DataTypes }=require('sequelize')
const sequelize = require('../conexion.js')

const Servicio = sequelize.define('servicios', {

  id_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre_servicio: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true
  },

  descripcion: {
    type: DataTypes.TEXT
  },

  duracion_minutos: {
    type: DataTypes.INTEGER,
    allowNull: false
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

module.exports = Servicio