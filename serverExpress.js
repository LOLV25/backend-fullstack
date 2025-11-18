// src/app.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { conectarABaseDeDatos } from './config/BaseDatos.js';
import { notFound } from './middlewares/notFound.js';
import { logger, loggerError } from "./middlewares/middlewares.js";
import { verificarToken } from "./middlewares/middlewares.js";
import { crearUsuario, mostrarUsuarios, mostrarUsuarioPorEmail, actualizarUsuario, eliminarUsuario,loginUsuario } from './controlador/usuarioController.js';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Conexión a BD
conectarABaseDeDatos();


// Ruta de prueba
app.get('/', (req, res) => res.json({ status: 'OK', service: 'PayWallet API' }));

// Logger para todas las solicitudes
app.use((req, res, next) => {
  logger(req);
  next();
});

// endpoints CRUD de usuarios
app.post('/api/usuarios',verificarToken, crearUsuario);
app.get('/api/usuarios', verificarToken, mostrarUsuarios);
app.get('/api/usuarios/:email',verificarToken, mostrarUsuarioPorEmail);
app.put('/api/usuarios/:id',verificarToken, actualizarUsuario);
app.delete('/api/usuarios/:id',verificarToken, eliminarUsuario);

//endpoint para login
app.post('/api/login', loginUsuario);

// Middleware de rutas no encontradas (404)
app.use(notFound);

// Middleware de errores (500)
app.use((err, req, res, next) => {
  loggerError(req);
  res.status(500).type("text/plain").send("Error interno del servidor");
});

// Conexión y arranque
const PORT = process.env.PORT || 4000;
conectarABaseDeDatos(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Servidor escuchando en el puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error al conectar a la base de datos de MongoDB:", err);
    process.exit(1); 
  });
