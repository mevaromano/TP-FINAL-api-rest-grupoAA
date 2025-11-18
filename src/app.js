import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import salonesRutas from './rutas/salonesrutas.js';
import authRutas from './rutas/authRutas.js';
import turnosRutas from './rutas/turnosRutas.js';
import reservasRutas from './rutas/reservasrutas.js';
import serviciosRutas from './rutas/serviciosrutas.js';
import usuariosRutas from './rutas/usuariosRutas.js';
import estadisticasRutas from './rutas/estadisticasRutas.js';
import reportesRutas from './rutas/reportesRutas.js';
import comentariosRutas from './rutas/comentariosRutas.js';

import pool from './datos/basededatos.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Notificaciones 
import NotificacionesService from './servicios/notificacioneservicio.js';
const noti = new NotificacionesService();
noti.verificarSMTP().catch(() =>
  console.log('⚠️ Advertencia: SMTP no pudo verificarse. Revisar .env')
);

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Reservas',
      version: '1.0.0',
      description: 'Documentación de la API REST del sistema de reservas de salones y servicios',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/rutas/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rutas principales 
app.use('/api/auth', authRutas);
app.use('/api/salones', salonesRutas);
app.use('/api/turnos', turnosRutas);
app.use('/api/reservas', reservasRutas);
app.use('/api/servicios', serviciosRutas);
app.use('/api/usuarios', usuariosRutas);
app.use('/api/estadisticas', estadisticasRutas);
app.use('/api/reportes', reportesRutas);
app.use('/api/comentarios', comentariosRutas);

// Test
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'pong' });
});

// Comprobar base de datos
async function probarDB() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    console.log(' MySQL funcionando | Resultado:', rows[0].resultado);
  } catch (e) {
    console.error(' Error al conectar a MySQL:', e.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor en http://localhost:${PORT}`);
  probarDB();
});