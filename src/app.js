//* DESAFIO ENTREGABLE WEBSOCKET + HANDLEBARS

import  express  from 'express';
import productRoute from '../routes/products.routes.js'
import cartRoute from '../routes/carts.routes.js'
import viewsRoute from '../routes/views.router.js'
import userRoute from '../routes/users.routes.js'
import authRoute from '../routes/auth.routes.js'
// import viewChat from '../routes/chat.routes.js'
import fileDirName from '../utils/fileDirName.js';
import handlebars from 'express-handlebars';
import configureSocket from '../socket/configure-socket.js';
import  mongoose  from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';


const {__dirname} = fileDirName(import.meta)

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+ "/"))

app.use(cookieParser("contraseña"))
app.use(session({
    store:MongoStore.create({
        mongoUrl:"mongodb://0.0.0.0/ecommerce",
        mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology:true
        },
    }),
    secret: "contraseña",
    resave: true,
    saveUninitialized:true
}))


app.engine('handlebars',handlebars.engine())
app.set('views',__dirname + '/views')
app.set('view engine','handlebars')

app.use('/api/products',productRoute)
app.use('/api/carts',cartRoute)
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)


app.use('/',viewsRoute)
// app.use('/chat',viewChat)

const port = 8080

const http = app.listen(port,()=> {
    console.log(`Servidor Express escuchando en el puerto ${port}`)
})


configureSocket(http);

mongoose.connect("mongodb://0.0.0.0/ecommerce",{useNewUrlParser: true,useUnifiedTopology:true});