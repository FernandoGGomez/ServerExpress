import CartService from "../services/cart.service.js";
import ProductService from "../services/product.service.js";

class CartController{

    #cartService;
    #productService;
    constructor(cartService,productService){
        this.#cartService = cartService;
        this.#productService = productService;
    }

    async create(req,res,next){
        
    
        await this.#cartService.create()

        res.status(200).send({ok:"true",message:"Carrito creado correctamente"})
        
        }


    async update(req,res,next){

        const {cid} = req.params
  
        const product = req.body
        const requiredProps = ['product', 'quantity'];
    
        const isValid = product.every(prod => {
            const objKeys = Object.keys(prod);
            return objKeys.length === requiredProps.length && objKeys.every(prop => requiredProps.includes(prop));
          });
    
        if(isValid){
           try{
            await this.#cartService.findById(cid)
            try{
                await this.#cartService.update(cid,product);
                res.status(200).send({message:"Carrito actualizado correctamente"});
            }catch(error){
                res.status(400).send({error:`The product with id ${product[0].product} cannot be updated because it doesn´t exist in the cart`})
            }
            

           }catch(error){
            return res.status(404).send({error: `The cart with id ${cid} doesn´t exist`})           
        }
    
        }
        else{
            res.status(500).send("No se pudo actualizar el carrito")
        }
        

    } 

    async updateQuantityOfProductInCart(req,res){

        const {cid,pid} = req.params; 
        const quantity = req.body[0].quantity;
    console.log("quantity:",quantity)
        if(!isNaN(Number(quantity))){
    
            const data = {product:pid,quantity:Number(quantity)}
            try{
                await this.#cartService.findById(cid);
            }catch(error){
                return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
            }
            
    
            try{
                await this.#productService.findById(pid);
            }catch(error){
                return res.status(400).send({Error: `El Producto con el id ${pid} no existe`})
            }
            
    
            try{
                await this.#cartService.updateQuantity(cid,data)
    
                res.send(`Producto ${pid} actualizado con la cantidad ${quantity}`)
            }catch(error){
                res.status(404).send({"Error":`El carrito con el id ${cid} no existe`})
            }
        }else{
    
            res.status(400).send({"Error":"Solo se puede modificar la propiedad quantity y solo puede recibir un valor numérico"})
        }
        
    }


    async findOne(req,res,next){

        const {cid} = req.params;
        try{
    
            const cart = await this.#cartService.findById(cid);
              res.status(200).send({cart:cart.cart})
        }catch(error){
            return res.status(400).send({error:`The cart with the id ${cid} doesn't exist`})
        }

        }


    async addProductToCart(req,res,next){

        const {cid,pid} = req.params; 

        try{

             await this.#cartService.findById(cid);
            
            try{
                
                 await this.#productService.findById(pid);


            }catch(error){
                return res.status(400).send({Error: `El Producto con el id ${pid} no existe`}) 
            }
                
            try{
                await this.#cartService.addProduct(cid,pid)
                const cart = await this.#cartService.findById(cid);
                res.status(200).send(cart)
            }catch(error){
                console.log(error)
                next(error)
            }
           

        }catch(error){
            console.log(error)
            return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
        }
        
    }



    async deleteProduct(req,res,next){
 

        const {cid,pid} = req.params; 

        try{
             await this.#cartService.findById(cid);
            try{
                await this.#productService.findById(pid);
               }catch{
                return res.status(400).send({Error: `El Producto con el id ${pid} no existe`}) 
               }
               
               try{
                  await this.#cartService.deleteProduct(cid,pid)
                  const updatedCart = await this.#cartService.findById(cid);
                  res.status(200).send(updatedCart)
               }catch(error){
                console.log(error)
                res.status(400).send({Error:"No se puede eliminar"})
               }
        }catch{
            return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
       } 

    }

    async delete(req,res,next){
        

        const {cid} = req.params;
        try{
            await this.#cartService.emptyCart(cid)

            res.status(200).send("Carrito vaciado correctamente")
        }catch(error){
            next(error)
        }
    }

    async updateError(req,res,next){   
        return res.status(400).send({Error: `Debe proporcionar el Id del producto a actualizar `})
    }

}

const controller = new CartController(new CartService(),new ProductService());

export default controller;