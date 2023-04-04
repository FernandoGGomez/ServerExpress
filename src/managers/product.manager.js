import { productsModel } from '../dao/models/products.model.js';
import { MongoManager } from './mongoManager.js';
class ProductManager{

    #products;

    constructor(persistencia){
        this.#products = [];
        this.persistencia = persistencia;
    }

    async addProduct(product,img){
        const {title,description,price,code,status,stock,category} = product;
        const products = await this.getProducts();
        const codeExist = products.some(prod => prod.code === code ) //Valido que el código no exista
        
        if(title && description && price && code && stock && category){ // Valido que todos los campos estén completados

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
                    category: category
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

