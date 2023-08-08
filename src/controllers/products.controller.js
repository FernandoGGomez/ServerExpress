import { Factory } from "../dao/factory.js";
import { logger } from "../logger/winston-logger.js";
import { productDeleted } from "../mailing/productDeleted.js";

class ProductController{

    #productService;
    #userService;
    constructor(productService,userService){
        this.#productService = productService;
        this.#userService = userService;
    }

    async create(req,res,next){
        
        try{
            const img = req.file?.path
            const product = req.body;
            const rol = req.user.rol;
            
            if(rol === "premium"){
                
                const email = req.user.email;

                const createProduct = {...product,owner:email}

                const productoAgregado = await this.#productService.create(createProduct);
    
                res.status(200).send(productoAgregado);
            }else{
                const productoAgregado = await this.#productService.create(product);
    
                res.status(200).send(productoAgregado);
            }
        
            

        }catch(error){
            logger.error("Ya existe un producto con ese código en la base de datos")
            res.status(400).send({error:"Ya existe un producto con ese código en la base de datos"})
        }
        
        }


    async update(req,res,next){

        const {pid} = req.params;
        const {_id} = req.body; 
        const {email,rol} = req.user;

        
        if(_id){
            return res.status(400).send({Error: `No se puede modificar el id del producto ${pid} `})
        }
        try{
            const product = await this.#productService.findById(pid);
            const owner = product.owner;
          
            if(email === owner || rol === "Admin"){
                try{
                    const updatedProduct =  await this.#productService.update({_id:pid},req.body);            
                    res.status(200).send(updatedProduct) 
                
                }catch(error){
                    logger.error(`The product with id ${pid} doesn´t exist`)
                    return res.status(404).send({Error: `The product with id ${pid} doesn´t exist`}) 
                }
            }else{
                res.status(401).send({error:"No puedes actualizar un producto de otra persona"})
            }

        }catch{
            logger.error(`The product with id ${pid} doesn´t exist`)
            return res.status(404).send({Error: `The product with id ${pid} doesn´t exist`}) 
        }
     
        
        

    } 

    async findAll(req,res,next){

            const query = req.query;
            const limit =  !isNaN(query.limit) ?  query.limit : 10;
            const page = !isNaN(query.page) ? query.page : 1;
            const sort = query.sort ==="asc" ? 1: query.sort ==="desc"?-1 : "";
            const category = query.category
            const status = query.status

            const products = await this.#productService.findAll(limit,page,sort,category,status);

            res.status(200).send({
                payload:products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage?"linkPrev" :null,
                nextLink:products.hasNextPage?"linkNext" :null ,
            });  

    }


    async findOne(req,res,next){
        const {pid} = req.params;
        try{  
            const productoFiltrado =  await this.#productService.findById(pid);     
            res.status(200).send(productoFiltrado)
        }catch(error){
            logger.error(`The product with id ${pid} doesn´t exist`)
            return res.status(404).send({Error: `The product with id ${pid} doesn´t exist`}) 
        }
    
        }

    async delete(req,res,next){

        const {pid} = req.params;
        const {email,rol} = req.user;

        try{
            const product = await this.#productService.findById(pid);
            const owner = product.owner;
          
            if(email === owner || rol === "Admin"){
                try{
                    await this.#productService.delete(pid);
                    try{
                        const user = await this.#userService.findOne({email:owner})
                        if(owner === user.email){
                            productDeleted(user.email,product.title)
                        }
                    }catch(error){
                    }
                    res.status(200).send(`El producto con el id ${pid} ha sido eliminado correactamente`)
                }catch(error){
                    logger.error(`The products with id ${pid} doesn´t exist`)
                    return res.status(404).send({Error: `The product with id ${pid} doesn´t exist`}) 
                }   

            }else{
                res.status(401).send({error:"No puedes eliminar un producto de otra persona"})
            }

           
        
      

    }catch(error){
        logger.error(`The product with id ${pid} doesn´t exist`)
        return res.status(404).send({Error: `The product with id ${pid} doesn´t exist`}) 
    }

    }

    async updateError(req,res,next){   
        logger.warning(`Debe proporcionar el Id del producto a actualizar `)
        return res.status(400).send({Error: `Debe proporcionar el Id del producto a actualizar `})
    }

}

const controller = new ProductController(await Factory.getDao("products"),await Factory.getDao("users"));

export default controller;