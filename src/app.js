import  express  from 'express';
import productRoute from './routes/products.routes.js';
import cartRoute from './routes/carts.routes.js';
import viewsRoute from './routes/views.router.js';
import authRoute from './routes/auth.routes.js';
import usersRoute from './routes/users.routes.js'
import sessionsRoute from './routes/sessions.routes.js'
import mockingRoute from './routes/mockingProducts.routes.js'
import loggerTestRoute from './routes/loggerTest.router.js'
import fileDirName from './utils/fileDirname.js';
import handlebars,{create} from 'express-handlebars';
import configureSocket from './socket/configure-socket.js';
import  mongoose  from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from './utils/configure.js';
import { configurePassport } from './config/passport.config.js';
import passport from 'passport';
import spec from './docs/swagger-options.js';
import swaggerUiExpress from "swagger-ui-express";



const {__dirname} = fileDirName(import.meta)
const {port,mongo_url,cookie_secret,secret_session} = config


const app = express();
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
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
        ttl:24*60*60
    }),
    secret:secret_session,
    resave: true,
    saveUninitialized:true
}))

configurePassport()
app.use(passport.initialize())
app.use(passport.session())

export const hbs = create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        isPremium(rol, options) {
          if (rol === 'premium') {
            return options.fn(this).toString();
          }
          return options.inverse(this).toString();
        }
      }
    });

app.engine('handlebars',hbs.engine)
app.set('views',__dirname + '/views')
app.set('view engine','handlebars')




app.use('/api/products',productRoute)
app.use('/api/carts',cartRoute)
app.use('/api/auth',authRoute)
app.use('/api/users',usersRoute)
app.use("/api/sessions",sessionsRoute)
app.use("/api/mockingproducts",mockingRoute)
app.use("/api/loggertest",loggerTestRoute)

 
app.use('/',viewsRoute)

const http = app.listen(port,()=> {
    console.log(`Servidor Express escuchando en el puerto ${port}`)
})


configureSocket(http);

mongoose.connect(mongo_url,{useNewUrlParser: true,useUnifiedTopology:true});