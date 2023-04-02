import  express  from 'express';
import { Router } from 'express';
import { uploader } from '../uploader.js';
import productManager from '../src/managers/product.manager.js';
import { productsModel } from '../src/dao/models/products.model.js';

const route = Router();
route.use(express.urlencoded({extended: true}))

route.get("/",async (req,res)=>{

    const query = req.query;
    const limit = query.limit? query.limit: 10;
    const page = query.page ? query.page : 1;
    const sort = query.sort ==="asc" ? 1: query.sort ==="desc"?-1 : "";
    const category = query.category
    const status = query.status


       
        const products =  await productsModel.paginate(category && status?{category:category,status:status}:category?{category:category}:status?{status:status}:{},{limit:limit,page:page,sort:{price:sort},lean:true});
       
        res.render("products",{
            products:products.docs,
            pages: products.totalPages,
            page: products.page,
            prev: products.prevPage,
            next: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage?"linkPrev" :null,
            nextLink:products.hasNextPage?"linkNext" :null ,
        });

     

    
   
    
   
   
    
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
