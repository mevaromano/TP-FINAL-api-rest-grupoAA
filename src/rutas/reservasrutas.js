import express from 'express';
import { body, param } from 'express-validator';
import * as reservasControlador from '../controladores/reservascontrolador.js';
import { requireAuth, empleadoOAdmin, soloAdmin } from '../middlewares/auth.js';

const router = express.Router();

//validaciones

const validateId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID debe ser un entero mayor a 0'),
];

const validateCreate = [
  body('fecha_reserva').isISO8601().withMessage('fecha_reserva inválida'),
  body('salon_id').isInt({ gt: 0 }).withMessage('salon_id inválido'),
  body('turno_id').isInt({ gt: 0 }).withMessage('turno_id inválido'),
  body('tematica').optional().isString().isLength({ max: 255 }),
  body('importe_salon').optional().isFloat({ gt: 0 }),
  body('importe_total').optional().isFloat({ gt: 0 }),
  body('foto_cumpleaniero').optional().isString().isLength({ max: 255 }),
];

const validateUpdate = [
  ...validateId,
  body('fecha_reserva').optional().isISO8601(),
  body('salon_id').optional().isInt({ gt: 0 }),
  body('turno_id').optional().isInt({ gt: 0 }),
  body('tematica').optional().isString().isLength({ max: 255 }),
  body('importe_salon').optional().isFloat({ gt: 0 }),
  body('importe_total').optional().isFloat({ gt: 0 }),
  body('foto_cumpleaniero').optional().isString().isLength({ max: 255 }),
];

/* ----------------------- RUTAS ------------------------------ */

// Cliente
router.get('/mias', requireAuth, reservasControlador.listarMias);
router.post('/', requireAuth, validateCreate, reservasControlador.crearReservaCliente);

// Empleado / Admin
router.get('/', requireAuth, empleadoOAdmin, reservasControlador.getReservas);
router.get('/:id', requireAuth, empleadoOAdmin, validateId, reservasControlador.getReservaById);

// Solo Admin
router.put('/:id', requireAuth, soloAdmin, validateUpdate, reservasControlador.updateReserva);
router.delete('/:id', requireAuth, soloAdmin, validateId, reservasControlador.deleteReserva);

export default router;