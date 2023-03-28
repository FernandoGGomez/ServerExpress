import  express  from 'express';
import { Router } from 'express';
import { uploader } from '../uploader.js';
import productManager from '../src/managers/product.manager.js';

const route = Router();
route.use(express.urlencoded({extended: true}))

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
    console.log(productoFiltrado)
    if(!productoFiltrado){

        return res.status(404).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

    res.status(200).send(productoFiltrado) 

   
});

route.post("/",uploader.single("thumbnail"), async (req,res)=>{

    const img = req.file?.path
    const product = req.body;
  
    const productoAgregado = await productManager.addProduct(product,img);

    if(typeof productoAgregado === "string"){

        return res.status(404).send({Error: productoAgregado})
    }else if(!productoAgregado){
        return res.status(404).send({Error: "All fields are required"})
    }
    
    res.status(200).send({product});

})


route.put("/",async (req,res)=>{
    return res.status(400).send({Error: `Debe proporcionar el Id del producto a actualizar `})
})

route.put("/:pid",async (req,res)=>{

    const {pid} = req.params;
    const {_id} = req.body; 
    
    if(_id){
        return res.status(400).send({Error: `No se puede modificar el id del producto ${pid} `})
    }

    const productoFiltrado =  await productManager.getProductById(pid);
    console.log("El console.log en products.routes",productoFiltrado)

    if(!productoFiltrado){

        return res.status(404).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

    

     await productManager.updateProduct(pid,req.body)
     
     const updatedProduct = await productManager.getProductById(pid);
     if(updatedProduct){

        res.status(200).send(updatedProduct) 
    
    }
    

})

route.delete("/:pid",async (req,res)=>{

    const {pid} = req.params;
    const productoFiltrado =  await productManager.getProductById(pid);
   
    if(!productoFiltrado){

        return res.status(404).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

    await productManager.deleteProduct(pid);

    res.status(200).send(`El producto con el id ${pid} ha sido eliminado correactamente`)

  

})

export default route;
