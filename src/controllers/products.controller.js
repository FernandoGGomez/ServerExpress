import { Factory } from "../dao/factory.js";
import { logger } from "../logger/winston-logger.js";

class ProductController{

    #service;
    constructor(service){
        this.#service = service;
    }

    async create(req,res,next){
        
        try{
            const img = req.file?.path
            const product = req.body;
        
            const productoAgregado = await this.#service.create(product);
    
            res.status(200).send(productoAgregado);

        }catch(error){
            logger.error(error)
            next(error)
        }
        
        }


    async update(req,res,next){

        const {pid} = req.params;
        const {_id} = req.body; 
        
        if(_id){
            return res.status(400).send({Error: `No se puede modificar el id del producto ${pid} `})
        }
        try{
            const product = await this.#service.findById(pid);
            if(!product){
                return res.status(400).send({Error: `The product with id ${pid} doesn´t exist `});
            }
            const updatedProduct =  await this.#service.update({_id:pid},req.body);            
            res.status(200).send(updatedProduct) 
        
        }catch(error){
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

            const products = await this.#service.findAll(limit,page,sort,category,status);

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
            const productoFiltrado =  await this.#service.findById(pid);     
            res.status(200).send(productoFiltrado)
        }catch(error){
            logger.error(`The product with id ${pid} doesn´t exist`)
            return res.status(404).send({Error: `The product with id ${pid} doesn´t exist`}) 
        }
    
        }

    async delete(req,res,next){

        const {pid} = req.params;
        try{
            await this.#service.delete(pid);
            res.status(200).send(`El producto con el id ${pid} ha sido eliminado correactamente`)
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

const controller = new ProductController(await Factory.getDao("products"));

export default controller;