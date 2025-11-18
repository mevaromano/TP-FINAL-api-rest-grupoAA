import express from 'express';
import { body, param } from 'express-validator';
import apicache from 'apicache';
import * as turnosControlador from '../controladores/turnosControlador.js';
import { requireAuth, empleadoOAdmin, soloAdmin } from '../middlewares/auth.js';

const router = express.Router();
const cache = apicache.middleware;

/**
 * @swagger
 * tags:
 *   - name: Turnos
 *     description: Endpoints para gestionar turnos
 */

/**
 * @swagger
 * /api/turnos:
 *   get:
 *     tags: [Turnos]
 *     summary: Lista todos los turnos activos (público, con cache)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   turno_id: { type: integer }
 *                   orden: { type: integer }
 *                   hora_desde: { type: string, example: "12:00:00" }
 *                   hora_hasta: { type: string, example: "14:00:00" }
 *                   activo: { type: integer }
 */

/**
 * @swagger
 * /api/turnos/{id}:
 *   get:
 *     tags: [Turnos]
 *     summary: Obtiene un turno por ID (público)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No encontrado }
 */

/**
 * @swagger
 * /api/turnos:
 *   post:
 *     tags: [Turnos]
 *     summary: Crea un turno (empleado o admin)
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             orden: 1
 *             hora_desde: "12:00:00"
 *             hora_hasta: "14:00:00"
 *     responses:
 *       201: { description: Creado }
 *       400: { description: Error de validación }
 *       401: { description: No autorizado }
 */

/**
 * @swagger
 * /api/turnos/{id}:
 *   put:
 *     tags: [Turnos]
 *     summary: Actualiza un turno (empleado o admin)
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             orden: 2
 *             hora_desde: "15:00:00"
 *             hora_hasta: "17:00:00"
 *     responses:
 *       200: { description: Actualizado }
 *       404: { description: No encontrado }
 */

/**
 * @swagger
 * /api/turnos/{id}:
 *   delete:
 *     tags: [Turnos]
 *     summary: Baja lógica de un turno (solo admin)
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No encontrado }
 */

//validaciones

const validateId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID debe ser un entero mayor a 0'),
];

const validateTurno = [
  body('orden')
    .isInt({ gt: 0 })
    .withMessage('El orden debe ser un entero mayor que 0'),

  body('hora_desde')
    .matches(/^\d{2}:\d{2}(:\d{2})?$/)
    .withMessage('hora_desde debe tener formato HH:MM o HH:MM:SS'),

  body('hora_hasta')
    .matches(/^\d{2}:\d{2}(:\d{2})?$/)
    .withMessage('hora_hasta debe tener formato HH:MM o HH:MM:SS'),
];

//rutas

//GET publicos 
router.get(
  '/',
  cache('2 minutos'),
  turnosControlador.getTurnos
);

router.get(
  '/:id',
  cache('2 minutos'),
  validateId,
  turnosControlador.getTurnoById
);

//Crear / actualizar: empleado o admin
router.post(
  '/',
  requireAuth,
  empleadoOAdmin,
  validateTurno,
  turnosControlador.createTurno
);

router.put(
  '/:id',
  requireAuth,
  empleadoOAdmin,
  validateId,
  validateTurno,
  turnosControlador.updateTurno
);

//Eliminar: solo admin
router.delete(
  '/:id',
  requireAuth,
  soloAdmin,
  validateId,
  turnosControlador.deleteTurno
);

export default router;