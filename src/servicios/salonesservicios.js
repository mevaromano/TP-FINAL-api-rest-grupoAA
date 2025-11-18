import * as dao from '../datos/salonesDAO.js';

// Listar todos los salones
export const getAllSalones = async () => {
  return await dao.findAll();
};

// Obtener un salon por ID
export const getSalonById = async (id) => {
  return await dao.findById(id);
};

// Crear un nuevo salon
export const createSalon = async (data) => {
  const id = await dao.insert(data);
  return id;
};

// Actualizar un salon
export const updateSalon = async (id, data) => {
  const filas = await dao.update(id, data);
  return filas;  
};

// Baja logica de un salon
export const deleteSalon = async (id) => {
  const filas = await dao.softDelete(id);
  return filas;  
};