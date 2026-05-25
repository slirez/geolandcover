const { DataTypes }=require('sequelize')
const sequelize = require('../conexion.js')

const HistorialCita = sequelize.define('historial_citas', {

  id_historial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_cita: {
    type: DataTypes.INTEGER
  },

  id_admin: {
    type: DataTypes.INTEGER
  },

  accion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  descripcion: {
    type: DataTypes.TEXT
  },

  estado_anterior: {
    type: DataTypes.ENUM(
      'programada',
      'confirmada',
      'cancelada',
      'reprogramada',
      'completada'
    )
  },

  estado_nuevo: {
    type: DataTypes.ENUM(
      'programada',
      'confirmada',
      'cancelada',
      'reprogramada',
      'completada'
    )
  },

  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  timestamps: false
})

module.exports = HistorialCita