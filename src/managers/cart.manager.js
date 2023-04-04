import { cartsModel } from '../dao/models/cart.model.js';
import { MongoManager } from './mongoManager.js';
class CartManager{

    #carts;

    constructor(persistencia){
        this.#carts = [];
        this.persistencia = persistencia;
    }

    async create(){
        try{

            const cart = this.persistencia.create()
            return cart

        }catch(error){

            throw error
        }
        

        }  

    async getAll() {
        try {
          const carts = await this.persistencia.getAll(); 
          return carts;
        } catch (error) {
          console.error("Ocurrio un error",error);
          return []; //si el archivo no existia o no tenía nada dentro retorno un array vacío
        }
      }


    async getCartById(id){

        try{
            const cart = await this.persistencia.findById(id); 
        
            if(cart){ //si existe el carrito lo retorno  
                return cart;
            }else{  //si no existe retorno un mensaje de error
                console.error("Cart with id: " + id + " Not found");
                
            }
        }catch(error){


            throw error
        }
    

    }

    


    async addProductToCart(cid, pid) {
        const carritoCargado = await this.getCartById(cid);
        if(!carritoCargado) {
          throw new Error('Carrito no encontrado')
        }
       
     
        const productoEnCarrito = JSON.parse(JSON.stringify(carritoCargado)).cart.find(element => element.product === pid);

        if(productoEnCarrito){
            
            
            //si existe el producto en el carrito
            const productoModificado = {product:pid,quantity:productoEnCarrito.quantity += 1}
            const carritoModificado = {...carritoCargado.cart,...productoModificado}
         
            this.persistencia.updateOne(cid,{cart:carritoModificado})

            return true
     


        } else{

            //No existe el producto en el carrito

            carritoCargado.cart.push({product:pid,quantity:+1})
            const carritoModificado = carritoCargado.cart        
            const data = {cart:carritoModificado}
            this.persistencia.updateOne(cid,data)
            return true
        }
        
      }



      async updateCart(cid,data){

        try{

            console.log("DATA: ",data)
            const updated= await this.persistencia.updateOne(cid,{cart:data})
            
            if (updated){
                return true
            }
                
            
        }catch(error){

            console.log("ERROR: ",error)
            throw error

        }
        
      }



    async updateProductInCart(cid,data){

        try{

            const carritoCargado = await this.getCartById(cid);
            const product = data.product
            if(Array.isArray(carritoCargado.cart) ){
             
                const productIndex = carritoCargado.cart.findIndex(prod => prod.product === product)

                if(productIndex !== -1){
                    carritoCargado.cart[productIndex] = {...carritoCargado.cart[productIndex],...data}
                }
             
                const updated= await this.persistencia.updateOne(cid,{cart:carritoCargado.cart})

                if (updated){
                    return true
                }
            }else{
                console.log("CARRITOCARGADO.CART no es un array")
            }
                   
            
        }catch(error){

            console.log("ERROR: ",error)
            throw error

        }


    }

    async deleteCart(id){
        
        this.persistencia.deleteOne({id:id})

    }

    async deleteProduct(cid, pid){

        const carritoCargado = await this.getCartById(cid);
        if(!carritoCargado) {
          throw new Error('Carrito no encontrado')
        }

        const productoEnCarrito = carritoCargado.cart.find(element => element.product === pid);

        if(productoEnCarrito){

            const carritoSinElProducto = carritoCargado.cart.filter(element => element.product !== pid)
            this.persistencia.updateOne(cid,{cart: carritoSinElProducto})

            return true
        }
    }
}


// export {CartManager};

const instancia = new CartManager(new MongoManager(cartsModel));
export default instancia;