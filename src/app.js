// DESAFIO ENTREGABLE
import  express  from 'express';
import { ProductManager } from './ProductManager.js';

const app = express();
app.use(express.urlencoded({extended: true}))
const path = "./data/products.json";

const productManager = new ProductManager(path) //genero una nueva instancia de la clase ProductManager
 


app.get("/products",(req,res)=>{

    const query = req.query;
    const limit = query.limit;

    async function products(){ // esta funcion trae los datos del archivo json y los envia como respuesta
    const productos =  await productManager.getProducts();
    console.log(limit)
        res.send({productos}) 
    }

    async function productsLimit(){ //esta funcion lee si hay un query limit y su valor y devuelve esa cantidad de productos
        const productos =  await productManager.getProducts();
        if(limit > productos.length){
            return res.send(`No contamos con esa cantidad de productos, actualmente contamos con ${productos.length} tipos de productos`);
        }
        const products = productos.slice(0,limit)

        return res.send(products);
    }

    if(limit !== ""){

       return productsLimit()
     
    }
   
    products()

})




app.get("/products/:pid",(req,res)=>{
   
    const {pid} = req.params;

    async function productById(){
        const productoFiltrado =  await productManager.getProductById(pid);
        if(typeof(productoFiltrado) !== "object"){

           return res.send({Error: `El Producto con el id ${pid} no existe`}) 

        }
        res.send({productoFiltrado}) 
    }

    productById()
   
})


const port = 8080

app.listen(port,()=> {
    console.log(`Servidor Express escuchando en el puerto ${port}`)
})