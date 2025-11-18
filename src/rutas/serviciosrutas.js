import express from 'express';
import { body, param } from 'express-validator';
import apicache from 'apicache';
import * as serviciosControlador from '../controladores/servicioscontrolador.js';
import { requireAuth, empleadoOAdmin, soloAdmin } from '../middlewares/auth.js';

const router = express.Router();
const cache = apicache.middleware;

//validaciones

//validacion de ID
const validateId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID debe ser un entero mayor a 0'),
];

//validacion de body para crear/editar servicio
const validateServicio = [
  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isString()
    .isLength({ max: 255 }),

  body('importe')
    .isFloat({ gt: 0 })
    .withMessage('El importe debe ser un número mayor que 0'),
];

//rutas

/**
 * GET /api/servicios
 * publico
 */
router.get(
  '/',
  cache('2 minutos'),
  serviciosControlador.getServicios
);

/**
 * GET /api/servicios/:id
 * publico
 */
router.get(
  '/:id',
  cache('2 minutos'),
  validateId,
  serviciosControlador.getServicioById
);

/**
 * POST /api/servicios
 * Empleado / Admin
 */
router.post(
  '/',
  requireAuth,
  empleadoOAdmin,
  validateServicio,
  serviciosControlador.createServicio
);

/**
 * PUT /api/servicios/:id
 * Empleado / Admin
 */
router.put(
  '/:id',
  requireAuth,
  empleadoOAdmin,
  validateId,
  validateServicio,
  serviciosControlador.updateServicio
);

/**
 * DELETE /api/servicios/:id
 * Solo Admin
 */
router.delete(
  '/:id',
  requireAuth,
  soloAdmin,
  validateId,
  serviciosControlador.deleteServicio
);

export default router;