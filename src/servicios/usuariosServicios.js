import * as dao from '../datos/usuariosDAO.js';

//Listar todos los usuarios
export const getAllUsuarios = async () => {
  return await dao.findAll();
};

//Usuario por ID
export const getUsuarioById = async (id) => {
  return await dao.findById(id);
};

//Solo clientes
export const getClientes = async () => {
  return await dao.findClientes();
};

//Crear usuario
export const createUsuario = async (usuario) => {
  const id = await dao.insert(usuario);
  return id;
};

//Actualizar usuario
export const updateUsuario = async (id, usuario) => {
  const filas = await dao.update(id, usuario);
  return filas;
};

//Baja logica
export const deleteUsuario = async (id) => {
  const filas = await dao.softDelete(id);
  return filas;
};

//buscar por nombre_usuario
export const findByNombreUsuario = async (nombre_usuario) => {
  return await dao.findByNombreUsuario(nombre_usuario);
};