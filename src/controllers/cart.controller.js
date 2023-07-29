import { randomUUID } from "crypto";
import { sendMail } from "../mailing/purchaseMail.js";
import { Factory } from "../dao/factory.js";
import { logger } from "../logger/winston-logger.js";

class CartController{

    #cartService;
    #productService;
    #ticketService
    constructor(cartService,productService,ticketService){
        this.#cartService = cartService;
        this.#productService = productService;
        this.#ticketService = ticketService;
    }

    async create(req,res,next){
        
        const cart = await this.#cartService.create()

        res.status(200).send({ok:"true",message:"Carrito creado correctamente"})
        
        }


    async update(req,res,next){

        const {cid} = req.params
        const user = req.user;
        const product = req.body
        const requiredProps = ['product', 'quantity'];
    
        const isValid = product.every(prod => {
            const objKeys = Object.keys(prod);
            return objKeys.length === requiredProps.length && objKeys.every(prop => requiredProps.includes(prop));
          });
    
        if(isValid){
            
            if(user.cart.toString() === `new ObjectId("${cid}")`){
            try{
                await this.#cartService.findById(cid)
                try{
                    await this.#cartService.update(cid,product);
                    res.status(200).send({message:"Carrito actualizado correctamente"});
                }catch(error){
                    logger.error(`The product with id ${product[0].product} cannot be updated because it doesn´t exist in the cart`)
                    res.status(400).send({error:`The product with id ${product[0].product} cannot be updated because it doesn´t exist in the cart`})
                }
                

            }catch(error){
                logger.error(`The cart with id ${cid} doesn´t exist`)
                return res.status(404).send({error: `The cart with id ${cid} doesn´t exist`})           
            }
            }else{
                res.status(401).send({error:"Este carrito no te pertenece"})
            }
        }else{
            logger.error("No se pudo actualizar el carrito")
            res.status(500).send("No se pudo actualizar el carrito")
        }
        

    } 

    async updateQuantityOfProductInCart(req,res){

        const {cid,pid} = req.params; 
        const quantity = req.body[0].quantity;
        const user = req.user;
        if(user.cart.toString() === `new ObjectId("${cid}")`){

            if(!isNaN(Number(quantity))){
        
                const data = {product:pid,quantity:Number(quantity)}
                try{
                    await this.#cartService.findById(cid);
                }catch(error){
                    logger.error(`El carrito con el id ${cid} no existe`)
                    return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
                }
                
        
                try{
                    await this.#productService.findById(pid);
                }catch(error){
                    logger.error(`El Producto con el id ${pid} no existe`)
                    return res.status(400).send({Error: `El Producto con el id ${pid} no existe`})
                }
                
        
                try{
                    await this.#cartService.updateQuantity(cid,data)
        
                    res.send(`Producto ${pid} actualizado con la cantidad ${quantity}`)
                }catch(error){
                    logger.error(`El carrito con el id ${cid} no existe`)
                    res.status(404).send({"Error":`El carrito con el id ${cid} no existe`})
                }
            }else{
                logger.error("Solo se puede modificar la propiedad quantity y solo puede recibir un valor numérico")
                res.status(400).send({"Error":"Solo se puede modificar la propiedad quantity y solo puede recibir un valor numérico"})
            }
        }else{
            res.status(401).send({error:"Este carrito no te pertenece"})
        }
        
    }


    async findOne(req,res,next){

        const {cid} = req.params;
        const user = req.user;
        if(user.cart.toString() === `new ObjectId("${cid}")`){
        try{
    
            const cart = await this.#cartService.findById(cid);
              res.status(200).send({cart:cart.cart})
        }catch(error){
            logger.error(`The cart with the id ${cid} doesn't exist`)
            return res.status(400).send({error:`The cart with the id ${cid} doesn't exist`})
        }
        }else{
            res.status(401).send({error:"Este carrito no te pertenece"})
        }
        }


    async addProductToCart(req,res,next){

        const {cid,pid} = req.params; 
        const user = req.user;
        try{

            await this.#cartService.findById(cid);
           
            if(user.cart.toString() === `new ObjectId("${cid}")`){
                try{
                
                    const product = await this.#productService.findById(pid);
                    if(!product){
                        res.status(404).send({error:"Ese producto no se encuentra en la base de datos"})
                          
                    }else if(product.owner === user.email){
                        res.status(401).send({error:"No puedes agregar un producto tuyo a tu carrito"}) 
                    }else{
                        try{
                            await this.#cartService.addProduct(cid,pid)
                            const cart = await this.#cartService.findById(cid);
                            res.status(200).send(cart)
                        }catch(error){
                            logger.error(error)
                            next(error)
                        }
                    }
    
                }catch(error){
                    logger.error(`El Producto con el id ${pid} no existe`)
                    return res.status(400).send({Error: `El Producto con el id ${pid} no existe`}) 
                }
            }else{
                res.status(401).send({error:"No puedes agregar un producto a un carrito que no te pertenece"})
            }
            
            
                
           
           

        }catch(error){
            logger.error(`El carrito con el id ${cid} no existe`)
            return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
        }
        
    }



    async deleteProduct(req,res,next){

        const {cid,pid} = req.params; 
        const user = req.user;
        if(user.cart.toString() === `new ObjectId("${cid}")`){

        try{
             await this.#cartService.findById(cid);
            try{
                await this.#productService.findById(pid);
               }catch{
                logger.error(`El Producto con el id ${pid} no existe`)

                return res.status(400).send({Error: `El Producto con el id ${pid} no existe`}) 
               }
               
               try{
                  await this.#cartService.deleteProduct(cid,pid)
                  const updatedCart = await this.#cartService.findById(cid);
                  res.status(200).send(updatedCart)
               }catch(error){
                logger.error("No se puede eliminar")
                res.status(400).send({Error:"No se puede eliminar"})
               }
        }catch{
            logger.error(`El carrito con el id ${cid} no existe`)
            return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
       } 
    }else{
        res.status(401).send({error:"Este carrito no te pertenece"})
    }
    }

    async delete(req,res,next){
        
        const {cid} = req.params;
        const user = req.user;
        if(user.cart.toString() === `new ObjectId("${cid}")`){
        try{
            await this.#cartService.emptyCart(cid)

            res.status(200).send("Carrito vaciado correctamente")
        }catch(error){
            logger.error(error)
            next(error)
        }
    }else{
        res.status(401).send({error:"Este carrito no te pertenece"})
    }
    }

    async updateError(req,res,next){  
        logger.warning(`Debe proporcionar el Id del producto a actualizar `) 
        return res.status(400).send({Error: `Debe proporcionar el Id del producto a actualizar `})
    }


    async purchase(req,res,next){

        const {cid} = req.params;
        const user = req.user;
        if(user.cart.toString() === `new ObjectId("${cid}")`){
        try{
            const cart = await this.#cartService.findById(cid)
            let pids = [];
            let amount = [];
            for (let i = 0 ; i < cart.cart.length ; i++){

                const quantity = JSON.parse(JSON.stringify(cart.cart[i].quantity))
                const stock = JSON.parse(JSON.stringify(cart.cart[i].product.stock))
                const pid =  JSON.parse(JSON.stringify(cart.cart[i].product._id))
                const product = await this.#productService.findById(pid)
                
                if(stock >= quantity){
                   product.stock -= quantity
                   amount.push(quantity)
                   await this.#productService.update({_id:pid},product)
                   await this.#cartService.deleteProduct(cid,pid)

                }else{
                    pids.push({product:JSON.parse(JSON.stringify(cart.cart[i].product._id)),quantity:quantity}) 
                }
            }   

            if(pids.length != 0){

                for (let i = 0 ; i < pids.length ; i++){
                        const data = [{product:pids[i].product,quantity:pids[i].quantity}]
                        await this.#cartService.update(cid,data)
                };

            }else{
                  await this.#cartService.emptyCart(cid)
            }
           
            
            
            const updatedCart = await this.#cartService.findById(cid)
            const ticket = {
                code:randomUUID(),
            
                purchase_datetime:new Date(),
            
                amount: amount.reduce((a,b)=> a+b,0),
            
                purchaser:req.user?.email || "hola" 
            }
            
           
            if(ticket.amount > 0){

                     this.#ticketService.create(ticket)
                     await sendMail(req.user.email,ticket)
                     if(amount.length != 0){
                       return res.status(200).send({error:"No hay stock suficiente de los siguientes productos",products:JSON.parse(JSON.stringify(updatedCart.cart.map(prod => prod.product._id)))})
                     }

                     
                    return res.status(200).send(ticket)
                }
           
            logger.warning(`No hay stock suficiente de los siguientes productos ${JSON.parse(JSON.stringify(updatedCart.cart.map(prod => prod.product._id)))}`)     
            res.status(200).send({error:"No hay stock suficiente de los siguientes productos",products:JSON.parse(JSON.stringify(updatedCart.cart.map(prod => prod.product._id)))})
                
                
           
           
           
          

        }catch(error){
            logger.error(`The cart with the id ${cid} doesn't exist`) 
            res.status(404).send({error:`The cart with the id ${cid} doesn't exist` })
        }
    }else{
        res.status(401).send({error:"Este carrito no te pertenece"})
    }
    }

}

const controller = new CartController(await Factory.getDao("cart"),await Factory.getDao("products"),await Factory.getDao("ticket"));

export default controller;