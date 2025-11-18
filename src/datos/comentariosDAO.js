import pool from './basededatos.js';

// Comentarios por reserva
export const findByReserva = async (reserva_id) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.nombre, u.apellido
     FROM comentarios c
     JOIN usuarios u ON u.usuario_id = c.usuario_id
     WHERE c.reserva_id = ? AND c.activo = 1
     ORDER BY c.creado DESC`,
    [reserva_id]
  );
  return rows;
};

// Crear comentario
export const insert = async ({ reserva_id, usuario_id, texto }) => {
  const [result] = await pool.query(
    `INSERT INTO comentarios (reserva_id, usuario_id, texto)
     VALUES (?, ?, ?)`,
    [reserva_id, usuario_id, texto]
  );
  return result.insertId;
};

// Baja logica
export const softDelete = async (id) => {
  const [result] = await pool.query(
    `UPDATE comentarios
     SET activo = 0, modificado = CURRENT_TIMESTAMP
     WHERE comentario_id = ?`,
    [id]
  );
  return result.affectedRows;
};

// Comentarios activos
export const findAllActivos = async () => {
  const [rows] = await pool.query(
    `SELECT c.*, u.nombre, u.apellido, r.reserva_id
     FROM comentarios c
     JOIN usuarios u ON u.usuario_id = c.usuario_id
     JOIN reservas r ON r.reserva_id = c.reserva_id
     WHERE c.activo = 1
     ORDER BY c.creado DESC`
  );
  return rows;
};