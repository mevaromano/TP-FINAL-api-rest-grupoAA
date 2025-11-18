import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

export default class NotificacionesService {
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const plantillaPath = path.join(__dirname, '../utils/handlebars/plantilla.hbs');
    const plantillaSrc = fs.readFileSync(plantillaPath, 'utf-8');
    this.template = handlebars.compile(plantillaSrc);

    // Transporter Gmail
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, 
      secure: false,
      auth: {
        user: process.env.CORREO,
        pass: process.env.CLAVE
      }
    });
  }

  async verificarSMTP() {
    await this.transporter.verify();
    console.log('Conexion SMTP verificada correctamente');
  }

  async enviarCorreo({ to, fecha, salon, turno }) {
    const html = this.template({ fecha, salon, turno });

    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Confirmacion de reserva',
      html
    });

    console.log('Email enviado correctamente a:', to, '| ID:', info.messageId);
    return info;
  }
}