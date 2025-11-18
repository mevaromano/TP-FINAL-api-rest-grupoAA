import pool from './basededatos.js';

//insertar reserva (cliente)
export const insertReserva = async (data) => {
  const {
    fecha_reserva,
    salon_id,
    usuario_id,
    turno_id,
    tematica = null,
    importe_salon = null,
    importe_total = null,
    foto_cumpleaniero = null,
  } = data;

  const sql = `
    INSERT INTO reservas
      (fecha_reserva, salon_id, usuario_id, turno_id, tematica,
       importe_salon, importe_total, foto_cumpleaniero, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;

  const params = [
    fecha_reserva,
    Number(salon_id),
    Number(usuario_id),
    Number(turno_id),
    tematica,
    importe_salon != null ? Number(importe_salon) : null,
    importe_total != null ? Number(importe_total) : null,
    foto_cumpleaniero
  ];

  const [r] = await pool.query(sql, params);
  return r.insertId;
};

//DATOS PARA CORREO (cliente y admin)
export const getDatosCorreo = async (usuario_id, salon_id, turno_id) => {
  const [rows] = await pool.query(
    `
      SELECT 
        u.nombre_usuario AS email,
        s.titulo AS salon,
        t.hora_desde,
        t.hora_hasta
      FROM usuarios u
      JOIN salones s ON s.salon_id = ?
      JOIN turnos  t ON t.turno_id = ?
      WHERE u.usuario_id = ?
      LIMIT 1
    `,
    [Number(salon_id), Number(turno_id), Number(usuario_id)]
  );

  return rows[0];
};

//TODAS LAS RESERVAS (Empleado/Admin)
export const getAllReservas = async () => {
  const [rows] = await pool.query(`
    SELECT r.*, 
           u.nombre AS cliente_nombre,
           u.apellido AS cliente_apellido,
           s.titulo AS salon,
           t.hora_desde, t.hora_hasta
    FROM reservas r
    JOIN usuarios u ON r.usuario_id = u.usuario_id
    JOIN salones s ON r.salon_id = s.salon_id
    JOIN turnos  t ON r.turno_id = t.turno_id
    WHERE r.activo = 1
    ORDER BY r.reserva_id DESC;
  `);
  return rows;
};

//RESERVA POR ID (Empleado/Admin)
export const getReservaById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT r.*, 
           u.nombre AS cliente_nombre,
           u.apellido AS cliente_apellido,
           s.titulo AS salon,
           t.hora_desde, t.hora_hasta
    FROM reservas r
    JOIN usuarios u ON r.usuario_id = u.usuario_id
    JOIN salones s ON r.salon_id = s.salon_id
    JOIN turnos  t ON r.turno_id = t.turno_id
    WHERE r.reserva_id = ? AND r.activo = 1
    `,
    [Number(id)]
  );
  return rows[0];
};

//RESERVAS DE UN CLIENTE (Cliente)
export const getReservasByUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `
    SELECT r.*, 
           s.titulo AS salon,
           t.hora_desde, t.hora_hasta
    FROM reservas r
    JOIN salones s ON r.salon_id = s.salon_id
    JOIN turnos  t ON r.turno_id = t.turno_id
    WHERE r.usuario_id = ? AND r.activo = 1
    ORDER BY r.reserva_id DESC
    `,
    [Number(usuario_id)]
  );
  return rows;
};

//ACTUALIZAR RESERVA (Solo Admin)
export const updateReserva = async (id, data) => {
  const columnas = [];
  const valores = [];

  for (const [key, value] of Object.entries(data)) {
    columnas.push(`${key} = ?`);
    valores.push(
      ['usuario_id', 'salon_id', 'turno_id'].includes(key)
        ? Number(value)
        : value ?? null
    );
  }

  columnas.push('modificado = CURRENT_TIMESTAMP');

  const sql = `
    UPDATE reservas
    SET ${columnas.join(', ')}
    WHERE reserva_id = ? AND activo = 1
  `;

  valores.push(Number(id));

  const [r] = await pool.query(sql, valores);
  return r.affectedRows;
};

//BAJA LOGICA (Solo Admin)
export const deleteReserva = async (id) => {
  const [r] = await pool.query(
    `
    UPDATE reservas
    SET activo = 0, modificado = CURRENT_TIMESTAMP
    WHERE reserva_id = ?
    `,
    [Number(id)]
  );

  return r.affectedRows;
};