//* DESAFIO ENTREGABLE WEBSOCKET + HANDLEBARS

import  express  from 'express';
import productRoute from '../routes/products.routes.js';
import cartRoute from '../routes/carts.routes.js';
import viewsRoute from '../routes/views.router.js';
import userRoute from '../routes/users.routes.js';
import authRoute from '../routes/auth.routes.js';
// import viewChat from '../routes/chat.routes.js'
import fileDirName from '../utils/fileDirName.js';
import handlebars from 'express-handlebars';
import configureSocket from '../socket/configure-socket.js';
import  mongoose  from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from '../utils/configure.js';
import { configurePassport } from './config/passport.config.js';
import passport from 'passport';


const {__dirname} = fileDirName(import.meta)
const {mongo_url,cookie_secret,secret_session} = config

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+ "/"))

app.use(cookieParser(cookie_secret))
app.use(session({
    store:MongoStore.create({
        mongoUrl:mongo_url,
        mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        },
        ttl:86400000
    }),
    secret:secret_session,
    resave: true,
    saveUninitialized:true
}))

configurePassport()
app.use(passport.initialize())
app.use(passport.session())


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

mongoose.connect(mongo_url,{useNewUrlParser: true,useUnifiedTopology:true});