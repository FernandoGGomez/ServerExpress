import  express  from 'express';
import { Router } from 'express';
import { ProductManager } from '../src/ProductManager.js';

const route = Router();
route.use(express.urlencoded({extended: true}))
const path = "products.json";

const productManager = new ProductManager(path) //genero una nueva instancia de la clase ProductManager

route.get("/",async (req,res)=>{

    const query = req.query;
    const limit = query.limit;
    const productos =  await productManager.getProducts();

    if(limit !== ""){

        if(limit > productos.length){
            return res.status(400).send(`No contamos con esa cantidad de productos, actualmente contamos con ${productos.length} tipos de productos`);
        }
        const products = productos.slice(0,limit)
      
        return res.send(products);
     
    }
   
    res.send({productos})

})




route.get("/:pid",async (req,res)=>{
   
    const {pid} = req.params;

    const productoFiltrado =  await productManager.getProductById(pid);
    if(typeof(productoFiltrado) !== "object"){

        return res.status(404).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

    res.send(productoFiltrado) 

   
});

route.post("/",async (req,res)=>{

    const product = req.body;
  
    await productManager.addProduct(product);

    res.send({product});

})

route.put("/:pid",async (req,res)=>{

    const {pid} = req.params;
    const {id} = req.body; 
    
    const productoFiltrado =  await productManager.getProductById(pid);
    if(typeof(productoFiltrado) !== "object"){

        return res.status(404).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

    if(id){
        return res.status(400).send({Error: `No se puede modificar el id del producto ${pid} `})
    }

    await productManager.modificar(pid,req.body)
    
    res.status(200).send(productoFiltrado) 

})

route.delete("/:pid",async (req,res)=>{

    const {pid} = req.params;
    const productoFiltrado =  await productManager.getProductById(pid);

    if(typeof(productoFiltrado) !== "object"){

        return res.status(404).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

    await productManager.deleteProduct(pid);

    res.status(200).send(`El producto con el id ${pid} ha sido eliminado correactamente`)

  

})

export default route;
