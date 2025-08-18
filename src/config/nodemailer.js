// src/config/nodemailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Asegurar que las variables estén cargadas
dotenv.config();

let transporter = null;
let emailConfig = null;

// Configuración con tus valores exactos como respaldo
const config = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  user: process.env.EMAIL_USER || '1705alejogomez@gmail.com',
  pass: process.env.EMAIL_PASS || 'frlmpniplpmfsetq',
  from: process.env.EMAIL_FROM || '1705alejogomez@gmail.com',
  fromName: process.env.EMAIL_FROM_NAME || 'Project Management API'
};

console.log('📧 Configurando email con:');
console.log('   Host:', config.host);
console.log('   Puerto:', config.port);
console.log('   Usuario:', config.user);
console.log('   Password:', config.pass ? 'CONFIGURADO ✅' : 'NO CONFIGURADO ❌');

try {
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  emailConfig = {
    from: {
      name: config.fromName,
      address: config.from
    }
  };

  // Verificar configuración
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email configuration error:', error.message);
      console.error('❌ Error completo:', error);
      transporter = null;
      emailConfig = null;
    } else {
      console.log('✅ Email server ready and verified!');
      console.log('✅ Configurado para enviar desde:', config.user);
    }
  });
} catch (error) {
  console.error('❌ Error configurando email:', error.message);
  transporter = null;
  emailConfig = null;
}

export { transporter, emailConfig };
export default transporter;