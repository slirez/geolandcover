const { Sequelize } = require('sequelize');

require('dotenv').config();

// Configuración para Aiven PostgreSQL
const sslEnabled = process.env.DB_SSL?.toLowerCase() !== 'false';

const sequelize = new Sequelize(
  process.env.DB_NAME?.trim(), // Nombre de la DB
  process.env.DB_USER?.trim(), // Usuario
  process.env.DB_PASSWORD?.trim(), // Contraseña
  {
    host: process.env.DB_HOST?.trim(),
    port: process.env.DB_PORT ? Number(process.env.DB_PORT.trim()) : undefined,
    dialect: 'postgres',
    dialectOptions: {
      ssl: sslEnabled
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    },
    logging: console.log, // opcional: para ver consultas SQL en consola
  }
);

// Prueba la conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a Aiven con Sequelize!');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

testConnection();

module.exports = sequelize;