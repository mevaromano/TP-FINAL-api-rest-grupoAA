import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import * as usrv from '../servicios/usuariosServicios.js';


//lista de usuarios

export const getUsuarios = async (_req, res) => {
  try {
    const rows = await usrv.getAllUsuarios();
    res.json(rows);
  } catch (e) {
    console.error('Error al listar usuarios:', e);
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
};


//buscar por id

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usrv.getUsuarioById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (e) {
    console.error('Error al obtener usuario:', e);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};


//clientes lista

export const getClientes = async (_req, res) => {
  try {
    const rows = await usrv.getClientes();
    res.json(rows);
  } catch (e) {
    console.error('Error al listar clientes:', e);
    res.status(500).json({ message: 'Error al listar clientes' });
  }
};


// Crear usuario.admin

export const createUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      nombre,
      apellido,
      nombre_usuario,
      contrasenia,
      tipo_usuario,
      celular,
      foto,
    } = req.body;

    const contrasenia_hash = bcrypt.hashSync(contrasenia, 10);

    const id = await usrv.createUsuario({
      nombre,
      apellido,
      nombre_usuario,
      contrasenia_hash,
      tipo_usuario,
      celular,
      foto
    });

    res.status(201).json({ id });
  } catch (e) {
    console.error('Error al crear usuario:', e);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};


//actualizar usuario. admin

export const updateUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const data = { ...req.body };

    
    if (data.contrasenia) {
      data.contrasenia_hash = bcrypt.hashSync(data.contrasenia, 10);
      delete data.contrasenia;
    }

    const ok = await usrv.updateUsuario(req.params.id, data);
    if (!ok) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ updated: ok });
  } catch (e) {
    console.error('Error al actualizar usuario:', e);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};


//soft delete

export const deleteUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const ok = await usrv.deleteUsuario(req.params.id);
    if (!ok) return res.status(404).json({ message: 'usuario no encontrado' });

    res.json({ deleted: ok });
  } catch (e) {
    console.error('Error al eliminar usuario:', e);
    res.status(500).json({ message: 'error al eliminar usuario' });
  }
};