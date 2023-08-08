import nodemailer from 'nodemailer';
import { config } from '../utils/configure.js';

export async function productDeleted(email,title,){
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
    subject:"Producto eliminado",
    html:`  <h1>Eliminamos uno de tus productos</h1>
            <h3>Eliminamos el producto: ${title}, de nuestra base de datos. <h3>
            
        `,

  })
}