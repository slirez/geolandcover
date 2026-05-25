const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Op } = require('sequelize'); // Importar Op para operaciones con Sequelize
// Importar el modelo de la BD
const { Cliente, Servicio, UsuarioAdmin, Cita, HistorialCita, Reporte } = require('./index'); // Importar los modelos
const app = express()
const puerto = 3000

const corsOptions = {
  origin: [
    'http://localhost:5173', // para desarrollo local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));

app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
})
