import nodemailer from 'nodemailer';
import { config } from '../utils/configure.js';

export async function inactiveAccount(email){
  const transport = nodemailer.createTransport({
    host: config.mail_host, 
    port: 587,
    auth: {
        user: config.mail_user,
        pass: config.mail_pass
    }
  })


  transport.sendMail({
    from: config.mail_company,
    to: email, 
    subject:"Cuenta inactiva",
    html:`  <h1>Eliminamos tu cuenta</h1>
            <h3>Debido a que tu cuenta estuvo más de 2 días inactiva ha sido eliminada de acuerdo con nuestros términos y condiciones.</h3>
            
        `,

  })
}