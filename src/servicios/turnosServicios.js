import * as dao from '../datos/turnosDAO.js';

// Listar turnos
export const getAllTurnos = async () => {
  return await dao.findAll();
};

// Turno por ID
export const getTurnoById = async (id) => {
  return await dao.findById(id);
};

// Crear turno
export const createTurno = async (data) => {
  const id = await dao.insert(data);
  return id;
};

// Actualizar turno
export const updateTurno = async (id, data) => {
  const filas = await dao.update(id, data);
  return filas;
};

// Baja logica
export const deleteTurno = async (id) => {
  const filas = await dao.softDelete(id);
  return filas;
};