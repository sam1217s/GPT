import { transporter, emailConfig } from '../config/nodemailer.js';

export const emailService = {
  async sendEmail(to, subject, html, text = null) {
    if (!transporter) {
      console.log('⚠️ Email no configurado. Email no enviado:', { to, subject });
      return { messageId: 'email-disabled' };
    }

    try {
      const mailOptions = {
        from: emailConfig.from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '') // Fallback text
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email enviado:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw error;
    }
  },

  async sendWelcomeEmail(email, firstName) {
    const subject = '¡Bienvenido a Project Management API!';
    const html = `
      <h1>¡Hola ${firstName}!</h1>
      <p>Bienvenido a nuestra plataforma de gestión de proyectos.</p>
      <p>Ahora puedes empezar a colaborar en proyectos increíbles.</p>
      <p>¡Que tengas un excelente día!</p>
    `;
    
    return await this.sendEmail(email, subject, html);
  },

  async sendPasswordResetEmail(email, resetToken, firstName) {
    const resetUrl = `${process.env.API_BASE_URL}/reset-password?token=${resetToken}`;
    const subject = 'Restablecer contraseña';
    const html = `
      <h1>Hola ${firstName}</h1>
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetUrl}">Restablecer contraseña</a>
      <p>Este enlace expira en 1 hora.</p>
      <p>Si no solicitaste este cambio, ignora este email.</p>
    `;
    
    return await this.sendEmail(email, subject, html);
  },

  async sendProjectInvitationEmail(email, projectName, firstName) {
    const subject = `Invitación al proyecto: ${projectName}`;
    const html = `
      <h1>Hola ${firstName}</h1>
      <p>Has sido invitado a colaborar en el proyecto <strong>${projectName}</strong>.</p>
      <p>Inicia sesión en la plataforma para comenzar a trabajar.</p>
      <p>¡Esperamos verte pronto!</p>
    `;
    
    return await this.sendEmail(email, subject, html);
  },

  async sendTaskAssignedEmail(email, taskTitle, projectName, firstName) {
    const subject = `Nueva tarea asignada: ${taskTitle}`;
    const html = `
      <h1>Hola ${firstName}</h1>
      <p>Se te ha asignado una nueva tarea en el proyecto <strong>${projectName}</strong>:</p>
      <h2>${taskTitle}</h2>
      <p>Revisa los detalles en la plataforma.</p>
      <p>¡Buen trabajo!</p>
    `;
    
    return await this.sendEmail(email, subject, html);
  },

  async sendProjectUpdateEmail(email, projectName, updateMessage, firstName) {
    const subject = `Actualización del proyecto: ${projectName}`;
    const html = `
      <h1>Hola ${firstName}</h1>
      <p>Hay actualizaciones en el proyecto <strong>${projectName}</strong>:</p>
      <p>${updateMessage}</p>
      <p>Revisa los cambios en la plataforma.</p>
    `;
    
    return await this.sendEmail(email, subject, html);
  }
};