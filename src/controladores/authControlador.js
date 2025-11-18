import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import pool from '../datos/basededatos.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { nombre_usuario, contrasenia } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = ? AND activo = 1',
      [nombre_usuario.trim()]
    );
    if (rows.length === 0) return res.status(401).json({ msg: 'credenciales invalidas' });

    const u = rows[0];
    const stored = u.contrasenia ?? '';
    let ok = false;

    // bcrypt 
 
    if (stored.startsWith('$2a$') || stored.startsWith('$2b$')) {
      ok = bcrypt.compareSync(contrasenia, stored);
    }

    // MD5 → migrar a bcrypt
    if (!ok && /^[a-f0-9]{32}$/i.test(stored)) {
      const md5 = crypto.createHash('md5').update(contrasenia).digest('hex');
      if (md5 === stored) {
        ok = true;
        const nuevoHash = bcrypt.hashSync(contrasenia, 10);
        await pool.query(
          'UPDATE usuarios SET contrasenia = ?, modificado = NOW() WHERE usuario_id = ?',
          [nuevoHash, u.usuario_id]
        );
      }
    }

    if (!ok) return res.status(401).json({ msg: 'credenciales invalidas' });

    const token = jwt.sign(
      { usuario_id: u.usuario_id, tipo_usuario: u.tipo_usuario, nombre_usuario: u.nombre_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'error de autenticacion' });
  }
};

