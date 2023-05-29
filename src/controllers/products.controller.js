import { Factory } from "../dao/factory.js";
import ProductService from "../dao/services/product.service.js";
import CustomError from "../errors/custom.error.js";

class ProductController{

    #service;
    constructor(service){
        this.#service = service;
    }

    async create(req,res,next){
        const {title,description,price,code,stock,category} = req.body;
        if(title && description && price && code && stock && category){
            try{
                const img = req.file?.path
                const product = req.body;
            
                const productoAgregado = await this.#service.create(product);
        
                res.status(200).send(productoAgregado);
    
            }catch(error){
                next(new CustomError({
                    name:"Product already exist",
                    cause:error,
                    message:error,
                    code:2
                }))
            }
        }else{
            const expectedProperties = ['title', 'description' ,'price','code','stock','category'];
            const missingProperties = expectedProperties.filter(prop => !Object.keys(req.body).includes(prop));
            next(new CustomError({
                name:"Fields empty",
                cause:"There are incomplete fields",
                message:`Failed attempt to create product, the fields: (${missingProperties}) are required`,
                code:2
            }))

        }
        
       
        
        }


    async update(req,res,next){

        const {pid} = req.params;
        const {_id} = req.body; 
        
        if(_id){
            next(new CustomError({
                name:"Can't modify the id of the product",
                cause:"Can't modify the id of the product",
                message:`Can't modify the id of the product ${pid}`,
                code:2
            }))
        }
        try{
            const product = await this.#service.findById(pid);
            if(!product){
                return res.status(400).send({Error: `The product with id ${pid} doesn´t exist `});
            }
            const updatedProduct =  await this.#service.update({_id:pid},req.body);
            console.log("El console.log en products.routes:",updatedProduct)
            
            res.status(200).send(updatedProduct) 
        
        }catch(error){
            next(new CustomError({
                name:"Product doesn't exist",
                cause:`The product with id ${pid} doesn´t exist`,
                message:`Can't update the product with id (${pid}) because doesn´t exist`,
                code:404
            }))
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
            console.log("PeoductoFiltrado",productoFiltrado) 
            if(!productoFiltrado){
                return res.status(400).send({Error: `The product with id ${pid} doesn´t exist`})
            }
            res.status(200).send(productoFiltrado)
        }catch(error){
            next(new CustomError({
                name:"Product doesn't exist",
                cause:`The product with id ${pid} doesn´t exist`,
                message:`Can't find the product with id (${pid}) because doesn´t exist`,
                code:404
            })) 
        }
    
        }

    async delete(req,res,next){

        const {pid} = req.params;
        try{
            await this.#service.delete(pid);
            res.status(200).send(`El producto con el id ${pid} ha sido eliminado correactamente`)
        }catch(error){
            next(new CustomError({
                name:"Product doesn't exist",
                cause:`The product with id ${pid} doesn´t exist`,
                message:`Can't delete the product with id (${pid}) because doesn´t exist`,
                code:404
            })) 
        }   

    }

    async updateError(req,res,next){   
        return res.status(400).send({Error: `Debe proporcionar el Id del producto a actualizar `})
    }

}

const controller = new ProductController(await Factory.getDao("products"));

export default controller;