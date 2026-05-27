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
    'http://127.0.0.1:5500',
    'http://localhost:5500'
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

// ===============================
// LOGIN ADMIN
// ===============================

app.post('/login', async (req, res) => {
  try {

    const { correo, password } = req.body;

    // Validación básica
    if (!correo || !password) {
      return res.status(400).json({
        error: 'Correo y contraseña son requeridos'
      });
    }

    // Buscar admin por correo
    const buscarAdmin = await UsuarioAdmin.findOne({
      where: { correo }
    });

    // Validación de existencia
    if (!buscarAdmin) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Validar contraseña
    if (password != buscarAdmin.password_hash) {
      return res.status(401).json({
        error: 'Contraseña inválida'
      });
    }

    res.send(buscarAdmin);

  } catch (error) {

    console.error('Error en login:', error);

    res.status(500).json({
      error: 'Error interno del servidor'
    });

  }
});

// ===============================
// REGISTRAR ADMIN
// ===============================

app.post('/agregar_admin', async (req, res) => {

  try {

    const { nombre, correo, password_hash, rol } = req.body;

    // Validar campos
    if (!nombre || !correo || !password_hash || !rol) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios"
      });
    }

    // Validar correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({
        error: "Formato de correo inválido"
      });
    }

    // Verificar correo existente
    const adminExistente = await UsuarioAdmin.findOne({
      where: { correo }
    });

    if (adminExistente) {
      return res.status(409).json({
        error: "El correo ya está registrado"
      });
    }

    // Crear admin
    const nuevoAdmin = await UsuarioAdmin.create({
      nombre,
      correo,
      password_hash,
      rol
    });

    return res.status(201).json({
      mensaje: "Administrador registrado exitosamente",
      admin: nuevoAdmin
    });

  } catch (error) {

    console.error("Error al registrar administrador:", error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// REGISTRAR CLIENTE / USUARIO
// ===============================
app.post('/agregar_cliente', async (req, res) => {
  try {
    const { nombre_completo, correo, telefono, password_hash, direccion, empresa } = req.body;

    // Validar campos obligatorios
    if (!nombre_completo || !correo || !password_hash) {
      return res.status(400).json({
        error: "Nombre, correo y contraseña son obligatorios"
      });
    }

    // Validar formato de correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({
        error: "Formato de correo inválido"
      });
    }

    // Verificar si el correo ya existe en tu modelo UsuarioAdmin
    const clienteExistente = await Cliente.findOne({
      where: { correo }
    });

    if (clienteExistente) {
      return res.status(409).json({
        error: "Este correo electrónico ya está registrado"
      });
    }

    // Crear el registro del cliente en la base de datos con rol 'cliente'
    const nuevoCliente = await Cliente.create({
      nombre_completo,
      correo,
      telefono,
      empresa,
      direccion,
      password_hash // Guarda la contraseña directamente
    });

    return res.status(201).json({
      mensaje: "Cliente registrado exitosamente",
      usuario: nuevoCliente
    });

  } catch (error) {
    console.error("Error al registrar cliente:", error);
    res.status(500).json({
      error: "Error interno del servidor al procesar el registro"
    });
  }
});
// ===============================
// VER CLIENTES
// ===============================

app.get('/clientes', async (req, res) => {

  try {

    const clientes = await Cliente.findAll();

    if (clientes.length === 0) {
      return res.status(404).json({
        mensaje: "No hay clientes registrados"
      });
    }

    res.json(clientes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// ACTUALIZAR CLIENTE
// ===============================

app.put('/actualizar_cliente/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre_completo,
      telefono,
      correo,
      direccion,
      empresa
    } = req.body;

    // Buscar cliente
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente no encontrado"
      });
    }

    // Actualizar datos
    cliente.nombre_completo = nombre_completo;
    cliente.telefono = telefono;
    cliente.correo = correo;
    cliente.direccion = direccion;
    cliente.empresa = empresa;

    await cliente.save();

    res.json({
      mensaje: "Cliente actualizado correctamente",
      cliente
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// ELIMINAR CLIENTE
// ===============================

app.delete('/eliminar_cliente/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const eliminado = await Cliente.destroy({
      where: { id_cliente: id }
    });

    if (!eliminado) {
      return res.status(404).json({
        error: 'Cliente no encontrado'
      });
    }

    res.status(204).send();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error interno del servidor'
    });

  }

});

// ===============================
// AGREGAR SERVICIO
// ===============================

app.post('/agregar_servicio', async (req, res) => {

  try {

    const {
      nombre_servicio,
      descripcion,
      duracion_minutos
    } = req.body;

    // Validaciones
    if (!nombre_servicio || !duracion_minutos) {
      return res.status(400).json({
        error: "Nombre y duración son obligatorios"
      });
    }

    // Verificar duplicado
    const servicioExistente = await Servicio.findOne({
      where: { nombre_servicio }
    });

    if (servicioExistente) {
      return res.status(409).json({
        error: "El servicio ya existe"
      });
    }

    // Crear servicio
    const nuevoServicio = await Servicio.create({
      nombre_servicio,
      descripcion,
      duracion_minutos
    });

    res.status(201).json({
      mensaje: "Servicio agregado correctamente",
      servicio: nuevoServicio
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// VER SERVICIOS
// ===============================

app.get('/servicios', async (req, res) => {

  try {

    const servicios = await Servicio.findAll();

    if (servicios.length === 0) {
      return res.status(404).json({
        mensaje: "No hay servicios registrados"
      });
    }

    res.json(servicios);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// CREAR CITA
// ===============================

app.post('/agendar_cita', async (req, res) => {

  try {

    const {
      id_cliente,
      id_servicio,
      id_admin,
      fecha,
      hora_inicio,
      hora_fin,
      informacion_adicional
    } = req.body;

    // Validar campos
    if (
      !id_cliente ||
      !id_servicio ||
      !fecha ||
      !hora_inicio ||
      !hora_fin
    ) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben completarse"
      });
    }

    // Crear cita
    const nuevaCita = await Cita.create({
      id_cliente,
      id_servicio,
      id_admin,
      fecha,
      hora_inicio,
      hora_fin,
      informacion_adicional
    });

    // Guardar historial
    await HistorialCita.create({
      id_cita: nuevaCita.id_cita,
      id_admin,
      accion: 'Creación de cita',
      descripcion: 'Se creó una nueva cita',
      estado_nuevo: 'programada'
    });

    res.status(201).json({
      mensaje: "Cita agendada correctamente",
      cita: nuevaCita
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// VER CITAS
// ===============================

app.get('/citas', async (req, res) => {

  try {

    const citas = await Cita.findAll();

    if (citas.length === 0) {
      return res.status(404).json({
        mensaje: "No hay citas registradas"
      });
    }

    res.json(citas);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// ACTUALIZAR ESTADO CITA
// ===============================

app.put('/actualizar_estado_cita/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const {
      estado,
      motivo_cancelacion,
      id_admin
    } = req.body;

    // Buscar cita
    const cita = await Cita.findByPk(id);

    if (!cita) {
      return res.status(404).json({
        error: "Cita no encontrada"
      });
    }

    // Guardar estado anterior
    const estadoAnterior = cita.estado;

    // Actualizar
    cita.estado = estado;
    cita.motivo_cancelacion = motivo_cancelacion;

    await cita.save();

    // Guardar historial
    await HistorialCita.create({
      id_cita: cita.id_cita,
      id_admin,
      accion: 'Cambio de estado',
      descripcion: `La cita cambió de ${estadoAnterior} a ${estado}`,
      estado_anterior: estadoAnterior,
      estado_nuevo: estado
    });

    res.json({
      mensaje: "Estado actualizado correctamente",
      cita
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// ELIMINAR CITA
// ===============================

app.delete('/eliminar_cita/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const eliminado = await Cita.destroy({
      where: { id_cita: id }
    });

    if (!eliminado) {
      return res.status(404).json({
        error: "Cita no encontrada"
      });
    }

    res.status(204).send();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});

// ===============================
// VER HISTORIAL DE UNA CITA
// ===============================

app.get('/historial/:id_cita', async (req, res) => {

  try {

    const { id_cita } = req.params;

    const historial = await HistorialCita.findAll({
      where: { id_cita }
    });

    if (historial.length === 0) {
      return res.status(404).json({
        mensaje: "No hay historial para esta cita"
      });
    }

    res.json(historial);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error interno del servidor"
    });

  }

});