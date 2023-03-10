import { randomUUID } from 'crypto';
import { promises } from 'fs';
class ProductManager{

    #products;

    constructor(path){
        this.#products = [];
        this.path = path;
    }

    async addProduct(product,img){
        const {title,description,price,code,status,stock} = product;
        const products = await this.getProducts();
        const codeExist = products.some(prod => prod.code === code ) //Valido que el código no exista
        
        if(title && description && price && code && stock){ // Valido que todos los campos estén completados

            if (codeExist){

                console.log(`Product code: ${code} has already been added`)

            }else{   //si el codigo de producto no existia lo pusheo en un array de productos  
                const id = randomUUID();
                const newProducts = [...products, {
                    // id: this.#products.some(prod => prod.id === 1) ? this.#products.length + 1:1,
                    id: id,
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: img || "",
                    code: code,
                    status: typeof status === "boolean" ? status : true,
                    stock: stock,
                }];
                const productsJson = JSON.stringify(newProducts);//convierto a formato .json el array
                await promises.writeFile(this.path,productsJson)//para cargarlo en el archivo
                return id

            }
        }else{
            console.log("All fields are required")
            return false
        }
        
      

    }

    async getProducts() {
        try {
          const products = await promises.readFile(this.path); //si el archivo existe y tiene contenido recupero sus datos
          return this.#products = JSON.parse(products);//cargo los datos del archivo a mi array this.#products
        } catch (error) {
          console.error("Ocurrio un error",error);
          return []; //si el archivo no existia o no tenía nada dentro retorno un array vacío
        }
      }


    async getProductById(id){

        const products = await this.getProducts(); //recupero los datos del archivo .json
        
        const exist = products.some(prod => prod.id === id)  //reviso si existe un producto con el id solicitado

        if(exist){ //si existe el producto lo retorno
            const productById = products.find(prod => prod.id === id) 
            return productById;
        }else{  //si no existe retorno un mensaje de error
            console.error("Product with id: " + id + " Not found");
        }

    }

    async updateProduct(id,field,value){   

        const products = await this.getProducts(); //recupero los datos del archivo .json
        const exist = products.some(prod => prod.id === id)  //reviso si existe un producto con el id solicitado

        if(!exist){
            console.error("The product with id " + id + " doesn't exist") //si no existe retorno un mensaje de error
            return
        }

        if(field === "id"){   //si el campo a modificar es el de "id" retorno un mensaje de error
            console.error(`Can't modify "id" field`)
            return
        }

        const fieldExist = this.#products.some(prod => prod[field]); //valido si el campo a modificar existía previamente
        
        if(!fieldExist){  //si no existía devuelvo un mensaje de error
            console.log(`The field ${field} can't be modify because doesn't exist`);
            return
        }

        const product = this.#products.find(prod => prod.id === id); //encuentro el producto que coincida con el id solicitado
        
        product[field]=value  //modifico el campo solicitado con el valor solicitado

        promises.writeFile(this.path,JSON.stringify(this.#products))  //sobreescribo el archivo existente



    }


    async modificar(id, datos) {
        const productoCargado = await this.getProductById(id);
        if(!productoCargado) {
          throw new Error('Producto no encontrado')
        }
        const todosLosProductos = await this.getProducts();
        const productoModificado = {...productoCargado, ...datos};
        const productosSinElProducto = todosLosProductos.filter(prod => prod.id !== id);
        const nuevosProductos = [...productosSinElProducto, productoModificado];
        const datosStr = JSON.stringify(nuevosProductos);
        await promises.writeFile(this.path, datosStr);
      }

    async deleteProduct(id){
        const products = await this.getProducts(); //recupero los datos del archivo .json
        const exist = products.some(prod => prod.id === id)  //reviso si existe un producto con el id solicitado

        if(!exist){ //si no existe el producto devuelvo un mensaje de error
            console.error("The product with id " + id + " can't be deleted because doesn't exist")
            return false
        }


        const productDelete = products.filter(prod => prod.id !== id); //filtro el array de productos y obtengo todos los que no coincidan con el id solicitado

        promises.writeFile(this.path,JSON.stringify(productDelete)); //sobreescribo el archivo .json con el array de productos filtrados

        return true
    }

}


export {ProductManager};