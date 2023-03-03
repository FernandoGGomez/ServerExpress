//*PRIMERA ENTREGA PROYECTO FINAL

import  express  from 'express';
import productRoute from '../routes/products.routes.js'
import cartRoute from '../routes/carts.routes.js'
import fileDirName from '../utils/fileDirName.js';


const {__dirname} = fileDirName(import.meta)

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+ "/"))

app.use('/api/products',productRoute)
app.use('/api/carts',cartRoute)




const port = 8080

app.listen(port,()=> {
    console.log(`Servidor Express escuchando en el puerto ${port}`)
})