const { DataTypes }=require('sequelize')
const sequelize = require('../conexion.js')

const Cita = sequelize.define('citas', {

  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  id_admin: {
    type: DataTypes.INTEGER
  },

  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },

  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },

  estado: {
    type: DataTypes.ENUM(
      'programada',
      'confirmada',
      'cancelada',
      'reprogramada',
      'completada'
    ),
    defaultValue: 'programada'
  },

  informacion_adicional: {
    type: DataTypes.TEXT
  },

  motivo_cancelacion: {
    type: DataTypes.TEXT
  },

  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  timestamps: false
})

module.exports = Cita;