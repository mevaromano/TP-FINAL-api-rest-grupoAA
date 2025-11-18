import pool from './basededatos.js';

// Todos los usuarios activos
export const findAll = async () => {
  const [rows] = await pool.query(
    'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, creado, modificado, activo FROM usuarios WHERE activo = 1'
  );
  return rows;
};

// Un usuario por ID
export const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, creado, modificado, activo FROM usuarios WHERE usuario_id = ? AND activo = 1',
    [Number(id)]
  );
  return rows[0];
};

// Clientes 
export const findClientes = async () => {
  const [rows] = await pool.query(
    'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, creado, modificado, activo FROM usuarios WHERE activo = 1 AND tipo_usuario = 3'
  );
  return rows;
};

// Buscar por nombre_usuario (para login)
export const findByNombreUsuario = async (nombre_usuario) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE nombre_usuario = ? AND activo = 1',
    [nombre_usuario]
  );
  return rows[0];
};

// Crear usuario
export const insert = async (usuario) => {
  const {
    nombre,
    apellido,
    nombre_usuario,
    contrasenia_hash,
    tipo_usuario,
    celular,
    foto,
  } = usuario;

  const sql = `
    INSERT INTO usuarios
      (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, activo, creado, modificado)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
  `;

  const [r] = await pool.query(sql, [
    nombre ?? null,
    apellido ?? null,
    nombre_usuario,
    contrasenia_hash,
    Number(tipo_usuario),
    celular ?? null,
    foto ?? null,
  ]);

  return r.insertId;
};

// Update 
export const update = async (id, usuario) => {
  let sql = `
    UPDATE usuarios
       SET nombre = ?,
           apellido = ?,
           nombre_usuario = ?,
           tipo_usuario = ?,
           celular = ?,
           foto = ?,
           modificado = CURRENT_TIMESTAMP
     WHERE usuario_id = ? AND activo = 1
  `;

  let params = [
    usuario.nombre ?? null,
    usuario.apellido ?? null,
    usuario.nombre_usuario,
    Number(usuario.tipo_usuario),
    usuario.celular ?? null,
    usuario.foto ?? null,
    Number(id),
  ];


  if (usuario.contrasenia_hash) {
    sql = `
      UPDATE usuarios
         SET nombre = ?,
             apellido = ?,
             nombre_usuario = ?,
             contrasenia = ?,
             tipo_usuario = ?,
             celular = ?,
             foto = ?,
             modificado = CURRENT_TIMESTAMP
       WHERE usuario_id = ? AND activo = 1
    `;
    params = [
      usuario.nombre ?? null,
      usuario.apellido ?? null,
      usuario.nombre_usuario,
      usuario.contrasenia_hash,
      Number(usuario.tipo_usuario),
      usuario.celular ?? null,
      usuario.foto ?? null,
      Number(id),
    ];
  }

  const [r] = await pool.query(sql, params);
  return r.affectedRows;
};

// Baja lógica
export const softDelete = async (id) => {
  const [r] = await pool.query(
    `UPDATE usuarios 
     SET activo = 0, modificado = CURRENT_TIMESTAMP 
     WHERE usuario_id = ?`,
    [Number(id)]
  );
  return r.affectedRows;
};