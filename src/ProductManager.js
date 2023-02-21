import exp from 'constants';
import { promises } from 'fs';
class ProductManager{

    #products;

    constructor(path){
        this.#products = [];
        this.path = path;
    }

    async addProduct(title,description,price,thumbnail,code,stock){
        const products = await this.getProducts();
        const codeExist = products.some(prod => prod.code === code ) //Valido que el código no exista
        
        if(title && description && price && thumbnail && code && stock){ // Valido que todos los campos estén completados

            if (codeExist){

                console.log(`Product code: ${code} has already been added`)

            }else{   //si el codigo de producto no existia lo pusheo en un array de productos  
                
                const newProducts = [...products, {
                    id: this.#products.some(prod => prod.id === 1) ? this.#products.length + 1:1,
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock,
                }];
                const productsJson = JSON.stringify(newProducts);//convierto a formato .json el array
                await promises.writeFile(this.path,productsJson)//para cargarlo en el archivo

            }
        }else{
            console.log("All fields are required")
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
        const exist = products.some(prod => prod.id === +id)  //reviso si existe un producto con el id solicitado

        if(exist){ //si existe el producto lo retorno
            const productById = products.find(prod => prod.id === +id) 
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

    async deleteProduct(id){
        const products = await this.getProducts(); //recupero los datos del archivo .json
        const exist = products.some(prod => prod.id === id)  //reviso si existe un producto con el id solicitado

        if(!exist){ //si no existe el producto devuelvo un mensaje de error
            console.error("The product with id " + id + " can't be deleted because doesn't exist")
            return
        }


        const productDelete = products.filter(prod => prod.id !== id); //filtro el array de productos y obtengo todos los que no coincidan con el id solicitado

        promises.writeFile(this.path,JSON.stringify(productDelete)); //sobreescribo el archivo .json con el array de productos filtrados

    }

}

// async function main(){

//     const path = "products.json"
//     const algo = new ProductManager(path)
    // await algo.addProduct("title","descr",599,"ImgPath","1232",12)
    // await algo.addProduct("title2","descr",609,"ImgPath","12332",12)
    // await algo.addProduct("title3","descr",400,"ImgPath","123321",12)
    // await algo.addProduct("title4","descr",500,"ImgPath","122",12)
    // await algo.addProduct("title5","descr",400,"ImgPath","12221212",12)
    // await algo.addProduct("titulo6","descr",400,"ImgPath","122212qwq12",12)
    // await algo.addProduct("title7","descr",599,"ImgPath","123agsdf2",12)
    // await algo.addProduct("title8","descr",609,"ImgPath","12cvxsbsdsfb332",12)
    // await algo.addProduct("title9","descr",400,"ImgPath","123scbsdfb321",12)
    // await algo.addProduct("title10","descr",500,"ImgPath","122beraerbaserb",12)
    // await algo.addProduct("title11","descr",400,"ImgPath","12aere3baerb221212",12)
    // await algo.addProduct("titulo12","descr",400,"ImgPath","122aerbqerb3req212qwq12",12)


    // await algo.updateProduct(1,"description",8000)
    // const prods = await algo.getProducts()
    // console.log("This is the getProducts:",prods)
    // console.log("Get Product by Id: ",await algo.getProductById(2))

    // await algo.deleteProduct(2)
// }

// main()
export {ProductManager};