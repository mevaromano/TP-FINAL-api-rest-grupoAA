import * as dao from '../datos/serviciosDAO.js';

// Listar todos los servicios
export const getAllServicios = async () => {
  return await dao.findAll();
};

// Servicio por ID
export const getServicioById = async (id) => {
  return await dao.findById(id);
};

// Crear servicio
export const createServicio = async (data) => {
  const id = await dao.insert(data);
  return id;
};

// Actualizar servicio
export const updateServicio = async (id, data) => {
  const filas = await dao.update(id, data);
  return filas;
};

// Baja logica
export const deleteServicio = async (id) => {
  const filas = await dao.softDelete(id);
  return filas;
};