import { productsModel } from '../dao/models/products.model.js';
import { MongoManager } from './mongoManager.js';
class ProductManager{

    #products;

    constructor(persistencia){
        this.#products = [];
        this.persistencia = persistencia;
    }

    async addProduct(product,img){
        const {title,description,price,code,status,stock} = product;
        const products = await this.getProducts();
        const codeExist = products.some(prod => prod.code === code ) //Valido que el código no exista
        
        if(title && description && price && code && stock){ // Valido que todos los campos estén completados

            if (codeExist){

                console.log(`Product code: ${code} has already been added`)
                return `Product code: ${code} has already been added`;

            }else{   //si el codigo de producto no existia lo pusheo en un array de productos  
                const newProduct =  {

                    title: title,
                    description: description,
                    price: price,
                    thumbnail: img || "",
                    code: code,
                    status: typeof status === "boolean" ? status : true,
                    stock: stock,
                };


                this.persistencia.create(newProduct);
                
                    return newProduct        

            }
        }else{
            console.log("All fields are required")
            return false
        }
        
      

    }

    async getProducts() {
        try {
          const products = await this.persistencia.getAll(); //si el archivo existe y tiene contenido recupero sus datos
          return this.#products = products;//cargo los datos del archivo a mi array this.#products
        } catch (error) {
          console.error("Ocurrio un error",error);
          return []; //si el archivo no existia o no tenía nada dentro retorno un array vacío
        }
      }


    async getProductById(id){

        try{
            const product = await this.persistencia.findById(id) 
            console.log("El PRODUCT: ",product)
            if(product !== null && !product.hasOwnProperty("stock")){
                return product; //si existe el producto lo retorno
            }else{
                return false
            }
            
        }catch(error){
            console.error("Product with id: " + id + " Not found"); //si no existe retorno un mensaje de error
            // throw error
        }
        
        
       

    }

    // async updateProduct(id,field,value){   
       
    //     const product = await this.getProductById(id)



    //     if(!product){
    //         console.error("The product with id " + id + " doesn't exist") //si no existe retorno un mensaje de error
    //         return
    //     }

    //     if(field === "id"){   //si el campo a modificar es el de "id" retorno un mensaje de error
    //         console.error(`Can't modify "id" field`)
    //         return
    //     }

    //     const fieldExist = this.#products.some(prod => prod[field]); //valido si el campo a modificar existía previamente
        
    //     if(!fieldExist){  //si no existía devuelvo un mensaje de error
    //         console.log(`The field ${field} can't be modify because doesn't exist`);
    //         return
    //     }

        
    //     const campo = product[field]  //modifico el campo solicitado con el valor solicitado

    //    this.persistencia.findByIdAndUpdate(id,campo, value)



    // }


    async updateProduct(id, datos) {
       try{
        const productoCargado = await this.getProductById(id);
        if(!productoCargado) {
          throw new Error('Producto no encontrado')
        }
            await this.getProducts();
            this.persistencia.updateOne(id,datos)
       }catch(error){
        throw error
       }
       
      }

    async deleteProduct(id){
        const deleted =  await this.persistencia.deleteOne(id);
        if(deleted){
            return true
        }

        return false
    }

}


// export {ProductManager};

const instancia = new ProductManager(new MongoManager(productsModel))

export default instancia;

