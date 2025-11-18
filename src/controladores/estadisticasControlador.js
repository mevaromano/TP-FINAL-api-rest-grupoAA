import * as svc from '../servicios/estadisticasServicios.js';

export const getEstadisticas = async (_req, res) => {
  try {
    const stats = await svc.obtenerEstadisticas();
    res.json(stats);
  } catch (error) {
    console.error("Error estadisticas:", error);
    res.status(500).json({ message: "Error al obtener estadisticas" });
  }
};