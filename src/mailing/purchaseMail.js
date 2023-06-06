import nodemailer from 'nodemailer';
import { config } from '../utils/configure.js';

export async function sendMail(email,ticket){
    const splitedEmail = email.split("@")
    const splitedEmail2 = splitedEmail[1]
    const splitedEmail3 = splitedEmail2.split(".")
    const dominio = splitedEmail3[0]

    const transport = nodemailer.createTransport({
    host: config.mail_host, // Acá iría  service : dominio
    port: 587,
    auth: {
        user: config.mail_user,
        pass: config.mail_pass
    }
  })


  transport.sendMail({
    from: config.mail_company,
    to: config.mail_user, //Acá iría el argumento email 
    subject:"¡Gracias por tu compra!",
    html:`  <h1>¡Gracias por tu compra!</h1>
            <h2>Acá está tu ticket:</h2>
            <ul>
                <li>Code: ${ticket.code}</li>
                <li>Fecha de compra:${ticket.purchase_datetime}</li>
                <li>Cantidad de productos: ${ticket.amount}</li>
            </ul>
        `,

  })

}