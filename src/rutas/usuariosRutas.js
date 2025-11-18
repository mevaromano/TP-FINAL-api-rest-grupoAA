import express from 'express';
import { body, param } from 'express-validator';
import * as usuariosControlador from '../controladores/usuarioscontrolador.js';
import { requireAuth, empleadoOAdmin, soloAdmin } from '../middlewares/auth.js';

const router = express.Router();

//validaciones comunes
const validateId = [
  param('id').isInt({ gt: 0 }).withMessage('ID invalido')
];

const validateCreate = [
  body('nombre').optional().isString().isLength({ max: 50 }),
  body('apellido').optional().isString().isLength({ max: 50 }),
  body('nombre_usuario').isEmail().withMessage('nombre_usuario debe ser un email valido'),
  body('contrasenia').isString().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('tipo_usuario').isInt({ min: 1, max: 3 }).withMessage('tipo_usuario debe ser 1=admin, 2=empleado, 3=cliente'),
  body('celular').optional().isString().isLength({ max: 20 }),
  body('foto').optional().isString().isLength({ max: 255 }),
];

const validateUpdate = [
  ...validateId,
  body('nombre').optional().isString().isLength({ max: 50 }),
  body('apellido').optional().isString().isLength({ max: 50 }),
  body('nombre_usuario').optional().isEmail(),
  body('contrasenia').optional().isString().isLength({ min: 6 }),
  body('tipo_usuario').optional().isInt({ min: 1, max: 3 }),
  body('celular').optional().isString().isLength({ max: 20 }),
  body('foto').optional().isString().isLength({ max: 255 }),
];

//rutas

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Gestión de usuarios (Admin) + listado de clientes (Admin/Empleado)
 */

// obtener TODOS los usuarios (admin)
router.get('/', requireAuth, soloAdmin, usuariosControlador.getUsuarios);

// obtener lista de CLIENTES – ADMIN o EMPLEADO
router.get('/clientes', requireAuth, empleadoOAdmin, usuariosControlador.getClientes);

// obtener usuario por ID (admin)
router.get('/:id',
  requireAuth,
  soloAdmin,
  validateId,
  usuariosControlador.getUsuarioById
);

// Crear usuario (admin)
router.post('/',
  requireAuth,
  soloAdmin,
  validateCreate,
  usuariosControlador.createUsuario
);

// Modificar usuario (admin)
router.put('/:id',
  requireAuth,
  soloAdmin,
  validateUpdate,
  usuariosControlador.updateUsuario
);

//Baja lógica usuario (admin)
router.delete('/:id',
  requireAuth,
  soloAdmin,
  validateId,
  usuariosControlador.deleteUsuario
);

export default router;