const { DataTypes }=require('sequelize')
const sequelize = require('../conexion.js')

const Reporte = sequelize.define('reportes', {

  id_reporte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_admin: {
    type: DataTypes.INTEGER
  },

  tipo_reporte: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  descripcion: {
    type: DataTypes.TEXT
  },

  fecha_generacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  timestamps: false
})

module.exports = Reporte