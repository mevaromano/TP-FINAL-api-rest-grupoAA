import * as dao from '../datos/reservasDAO.js';
import NotificacionesService from './notificacioneservicio.js';

const noti = new NotificacionesService();


//crear reserva cleinte

export const crearReservaCliente = async (data) => {

  //1-Insert de la reserva
  const reservaId = await dao.insertReserva(data);

  //2-Datos para el correo
  const info = await dao.getDatosCorreo(
    data.usuario_id,
    data.salon_id,
    data.turno_id
  );

  //3-Notificar cliente y admin
  try {
    await noti.enviarCorreo({
      to: info.email,
      fecha: data.fecha_reserva,
      salon: info.salon,
      turno: `${info.hora_desde} - ${info.hora_hasta}`
    });

    if (process.env.ADMIN_EMAIL) {
      await noti.enviarCorreo({
        to: process.env.ADMIN_EMAIL,
        fecha: data.fecha_reserva,
        salon: info.salon,
        turno: `${info.hora_desde} - ${info.hora_hasta}`
      });
    }

  } catch (err) {
    console.error('Error al enviar correo:', err.message);
  }

  return reservaId;
};

// Empleado/Admin: todas las reservas activas

export const getAllReservas = async () => {
  return await dao.getAllReservas();
};

// Empleado/Admin: reserva por ID

export const getReservaById = async (id) => {
  return await dao.getReservaById(id);
};


// Cliente: sus reservas

export const getReservasByUsuario = async (usuario_id) => {
  return await dao.getReservasByUsuario(usuario_id);
};


// Admin: actualizar reserva
export const updateReserva = async (id, data) => {
  return await dao.updateReserva(id, data);
};


// Admin: baja logica de reserva
export const deleteReserva = async (id) => {
  return await dao.deleteReserva(id);
};