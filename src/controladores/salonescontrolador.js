import { validationResult } from 'express-validator';
import * as salonesservicios from '../servicios/salonesservicios.js';

export const getSalones = async (req, res) => {
  try {
    const salones = await salonesservicios.getAllSalones();
    res.json(salones);
  } catch (error) {
    console.error('Error al buscar salones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getSalonById = async (req, res) => {
  try {
    const salon = await salonesservicios.getSalonById(req.params.id);
    if (!salon) {
      return res.status(404).json({ message: 'Salon no encontrado' });
    }
    res.json(salon);
  } catch (error) {
    console.error('Error al buscar salon:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const createSalon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newId = await salonesservicios.createSalon(req.body);
    res.status(201).json({ message: 'Salon creado', id: newId });
  } catch (error) {
    console.error('Error al crear salon:', error);
    res.status(500).json({ message: 'Error al crear salon' });
  }
};


export const updateSalon = async (req, res) => {
  try {
    const updated = await salonesservicios.updateSalon(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Salon no encontrado' });
    }
    res.json({ message: 'Salon actualizado' });
  } catch (error) {
    console.error('Error al actualizar salon:', error);
    res.status(500).json({ message: 'Error al actualizar salon' });
  }
};


export const deleteSalon = async (req, res) => {
  try {
    const deleted = await salonesservicios.deleteSalon(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'salon no encontrado' });
    }
    res.json({ message: 'salon eliminado' });
  } catch (error) {
    console.error('error al eliminar salon:', error);
    res.status(500).json({ message: 'Error al eliminar salon' });
  }
};
