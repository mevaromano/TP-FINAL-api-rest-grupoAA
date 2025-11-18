import express from 'express';
import { body, param } from 'express-validator';
import apicache from 'apicache';
import * as salonescontrolador from '../controladores/salonescontrolador.js';
import { requireAuth, empleadoOAdmin, soloAdmin } from '../middlewares/auth.js';

const router = express.Router();
const cache = apicache.middleware;


// validacion de ID
const validateId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID debe ser un entero mayor a 0'),
];

// validacion de body para crear y editar
const validateSalon = [
  body('titulo').notEmpty().withMessage('El titulo es obligatorio'),
  body('direccion').notEmpty().withMessage('La direccion es obligatoria'),
  body('importe').isFloat({ gt: 0 }).withMessage('El importe debe ser mayor a 0'),
];

//rutas

/**
 * GET /api/salones
 * Publico 
 */
router.get(
  '/',
  cache('2 minutos'),
  salonescontrolador.getSalones
);

/**
 * GET /api/salones/:id
 */
router.get(
  '/:id',
  cache('2 minutos'),
  validateId,
  salonescontrolador.getSalonById
);

/**
 * POST /api/salones
 * Solo empleado o admin
 */
router.post(
  '/',
  requireAuth,
  empleadoOAdmin,
  validateSalon,
  salonescontrolador.createSalon
);

/**
 * PUT /api/salones/:id
 * Solo empleado o admin
 */
router.put(
  '/:id',
  requireAuth,
  empleadoOAdmin,
  validateId,
  validateSalon,
  salonescontrolador.updateSalon
);

/**
 * DELETE /api/salones/:id
 * Solo admin
 */
router.delete(
  '/:id',
  requireAuth,
  soloAdmin,
  validateId,
  salonescontrolador.deleteSalon
);

export default router;

