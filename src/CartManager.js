import { randomUUID } from 'crypto';
import { promises } from 'fs';
import { type } from 'os';
class CartManager{

    #carts;

    constructor(path){
        this.#carts = [];
        this.path = path;
    }

    async createCart(){

        const carts = await this.getCarts();        
        const newCarts = [...carts, {
            id: randomUUID(),
            products:[]
        }];

        const cartsJson = JSON.stringify(newCarts);//convierto a formato .json el array
        await promises.writeFile(this.path,cartsJson)//para cargarlo en el archivo

        }
        
      

    

    async getCarts() {
        try {
          const carts = await promises.readFile(this.path); //si el archivo existe y tiene contenido recupero sus datos
          return this.#carts = JSON.parse(carts);//cargo los datos del archivo a mi array this.#carts
        } catch (error) {
          console.error("Ocurrio un error",error);
          return []; //si el archivo no existia o no tenía nada dentro retorno un array vacío
        }
      }


    async getCartById(id){

        const carts = await this.getCarts(); //recupero los datos del archivo .json
        const exist = carts.some(car => car.id === id)  //reviso si existe un carrito con el id solicitado
        
        if(exist){ //si existe el carrito lo retorno
            const cartById = carts.find(car => car.id === id) 
            return cartById;
        }else{  //si no existe retorno un mensaje de error
            console.error("Cart with id: " + id + " Not found");
            
        }

    }

    


    async modificar(cid, pid) {
        const carritoCargado = await this.getCartById(cid);
        if(!carritoCargado) {
          throw new Error('Carrito no encontrado')
        }
        const todosLosCarritos = await this.getCarts();
 
        if(carritoCargado.products.hasOwnProperty(0) ){  //valido que products tenga algo en la posicion 0 
            const productoEnCarrito = carritoCargado.products.map(element => {
                
             return element.product == pid 
            });

            if(productoEnCarrito.some(prod => prod == true)){
                
                //si existe el producto en el carrito
                carritoCargado.products[carritoCargado.products.findIndex(element => element.product == pid)].quantity += 1 ;
    
                const carritoModificado = {...carritoCargado };
                const carritoSinElProducto = todosLosCarritos.filter(car => car.id !== cid);
                const nuevosCarritos = [...carritoSinElProducto,carritoModificado];
                const datosStr = JSON.stringify(nuevosCarritos);
                await promises.writeFile(this.path, datosStr);
    
    
            } else{
               //No existe el producto en el carrito


                const productEnCarrito = {product: pid,quantity: 1}
                carritoCargado.products.push(productEnCarrito);
                const carritoModificado = {...carritoCargado};
                const carritoSinElProducto = todosLosCarritos.filter(car => car.id !== cid);
                const nuevosCarritos = [...carritoSinElProducto,carritoModificado];
                const datosStr = JSON.stringify(nuevosCarritos);
                await promises.writeFile(this.path, datosStr);
    
            }
        }
        else{
            //No existe el producto en el carrito
  
            const productEnCarrito = [{product:pid,quantity:1}]
            const carritoModificado = {...carritoCargado,products:productEnCarrito};
            const carritoSinElProducto = todosLosCarritos.filter(car => car.id !== cid);
            const nuevosCarritos = [...carritoSinElProducto,carritoModificado];
            const datosStr = JSON.stringify(nuevosCarritos);
            await promises.writeFile(this.path, datosStr);

        }
        
      }

    async deleteCart(id){
        const carts = await this.getCarts(); //recupero los datos del archivo .json
        const exist = carts.some(car => car.id === id)  //reviso si existe un carrito con el id solicitado

        if(!exist){ //si no existe el carrito devuelvo un mensaje de error
            console.error("The cart with id " + id + " can't be deleted because doesn't exist")
            return
        }


        const cartDelete = carts.filter(car => car.id !== id); //filtro el array de carritos y obtengo todos los que no coincidan con el id solicitado

        promises.writeFile(this.path,JSON.stringify(cartDelete)); //sobreescribo el archivo .json con el array de carritos filtrados

    }

}


export {CartManager};