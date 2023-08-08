import { randomUUID } from 'crypto';
import { promises } from 'fs';
import { type } from 'os';
class CartManager{

    #carts;

    constructor(path){
        this.#carts = [];
        this.path = path;
    }

    async create(){

        const carts = await this.getCarts();        
        const newCarts = [...carts, {cart:{
            id: randomUUID(),
            products:[]
        }
           
        }];

        const cartsJson = JSON.stringify(newCarts);//convierto a formato .json el array
        await promises.writeFile(this.path,cartsJson)//para cargarlo en el archivo

        }
        
      

    

    async getCarts() {
        try {
          const carts = await promises.readFile(this.path,'utf-8'); //si el archivo existe y tiene contenido recupero sus datos
          return this.#carts = JSON.parse(carts);//cargo los datos del archivo a mi array this.#carts
        } catch (error) {
          console.error("Ocurrio un error",error);
          return []; //si el archivo no existia o no tenía nada dentro retorno un array vacío
        }
      }


    async findById(id){
        try{
            const carts = await this.getCarts(); //recupero los datos del archivo .json
            const exist = carts.some(car => car.cart.id === id)  //reviso si existe un carrito con el id solicitado
            if(exist){ //si existe el carrito lo retorno
                const cartById = carts.find(car => car.cart.id === id) 
                return cartById;
            }else{  //si no existe retorno un mensaje de error
                console.error("Cart with id: " + id + " Not found");
                
            }
        }catch(error){
            console.log(error)
        }
       

    }

    


    async addProduct(cid, pid) {
       try{
        const carritoCargado = await this.findById(cid);
        if(!carritoCargado) {
          throw new Error('Carrito no encontrado')
        }
        const todosLosCarritos = await this.getCarts();
 
        const productoEnCarrito = carritoCargado.cart.products.map(element => {
            return element.product == pid 
        });
        
        if(productoEnCarrito.some(prod => prod == true)){
            //si existe el producto en el carrito
            carritoCargado.cart.products[carritoCargado.cart.products.findIndex(element => element.product == pid)].quantity += 1 ;
            const carritoModificado = {...carritoCargado };
            const carritoSinElProducto = todosLosCarritos.filter(car => car.id !== cid);
            const nuevosCarritos = [...carritoSinElProducto,carritoModificado];
            const datosStr = JSON.stringify(nuevosCarritos);
            await promises.writeFile(this.path, datosStr);


        } else{
            //No existe el producto en el carrito
            const productEnCarrito = {product: pid,quantity: 1}
            carritoCargado.cart.products.push(productEnCarrito);
            const carritoModificado = {...carritoCargado};
            const carritoSinElProducto = todosLosCarritos.filter(car => car.cart.id !== cid);
            const nuevosCarritos = [...carritoSinElProducto,carritoModificado];
            const datosStr = JSON.stringify(nuevosCarritos);
            await promises.writeFile(this.path, datosStr);

        }
       }catch(error){
        console.log(error)
       }
        
        
      }
    
    async emptyCart(id){
        await promises.writeFile(this.path, []);
        return []
    }
    async delete(id){
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