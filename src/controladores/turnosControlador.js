import { validationResult } from 'express-validator';
import * as turnosservicios from '../servicios/turnosServicios.js';


//GET TODOS LOS TURNOS

export const getTurnos = async (req, res) => {
  try {
    const rows = await turnosservicios.getAllTurnos();
    res.json(rows);
  } catch (error) {
    console.error('Error al buscar turnos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



//GET POR ID

export const getTurnoById = async (req, res) => {
  try {
    const row = await turnosservicios.getTurnoById(req.params.id);
    if (!row) return res.status(404).json({ message: 'turno no encontrado' });
    res.json(row);
  } catch (error) {
    console.error('Error al buscar turno:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



//CREAR TURNO

export const createTurno = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { orden, hora_desde, hora_hasta } = req.body;

  try {
    const id = await turnosservicios.createTurno({ orden, hora_desde, hora_hasta });
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error al crear turno:', error);
    res.status(500).json({ message: 'Error al crear turno' });
  }
};



//ACTUALIZAR TURNO

export const updateTurno = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { orden, hora_desde, hora_hasta } = req.body;

  try {
    const ok = await turnosservicios.updateTurno(req.params.id, {
      orden,
      hora_desde,
      hora_hasta
    });

    if (!ok) return res.status(404).json({ message: 'turno no encontrado' });
    res.json({ message: 'Turno actualizado' });

  } catch (error) {
    console.error('Error al actualizar turno:', error);
    res.status(500).json({ message: 'Error al actualizar turno' });
  }
};



//ELIMINAR TURNO

export const deleteTurno = async (req, res) => {
  try {
    const ok = await turnosservicios.deleteTurno(req.params.id);
    if (!ok) return res.status(404).json({ message: 'turno no encontrado' });
    res.json({ message: 'Turno eliminado' });
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    res.status(500).json({ message: 'Error al eliminar turno' });
  }
};