//* DESAFIO ENTREGABLE WEBSOCKET + HANDLEBARS

import  express  from 'express';
import productRoute from '../routes/products.routes.js'
import cartRoute from '../routes/carts.routes.js'
import viewsRoute from '../routes/views.router.js'
import fileDirName from '../utils/fileDirName.js';
import handlebars from 'express-handlebars';
import configureSocket from '../socket/configure-socket.js';


const {__dirname} = fileDirName(import.meta)

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+ "/"))

app.engine('handlebars',handlebars.engine())
app.set('views',__dirname + '/views')
app.set('view engine','handlebars')

app.use('/api/products',productRoute)
app.use('/api/carts',cartRoute)

app.use('/',viewsRoute)


const port = 8080

const http = app.listen(port,()=> {
    console.log(`Servidor Express escuchando en el puerto ${port}`)
})


configureSocket(http);