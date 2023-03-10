import { Server } from "socket.io";
import { ProductManager } from "../src/ProductManager.js";
export default function configureSocket(httpServer){
   const socketServer = new Server(httpServer);
    
   socketServer.on("connection",(socket)=>{

        const path = "./data/products.json";
        const productManager = new ProductManager(path)
        console.log("socket conectado")
        socket.on("add_product",async (product)=>{
            console.log("Este es product: ",product)
           
            const productoAgregado = await productManager.addProduct(product)
          
            if(productoAgregado){
    
                const nuevoProducto = await productManager.getProductById(productoAgregado)
    
                socket.emit("producto_agregado",nuevoProducto)
                socket.broadcast.emit("producto_agregado",nuevoProducto)//Esto solo es necesario si se quiere que todos los clientes reciban la actualaización del producto
            }else{
                socket.emit("producto_agregado",false)
                socket.broadcast.emit("producto_agregado",false)//Esto solo es necesario si se quiere que todos los clientes reciban la actualaización del producto
            }
            
            
            
                        
        })
        
        socket.on("delete_product",async(product_id)=>{
            const deleted = await productManager.deleteProduct(product_id)
            if(deleted){
                socket.emit("deleted",deleted)
                socket.broadcast.emit("deleted",deleted)//Esto solo es necesario si se quiere que todos los clientes reciban la actualaización de la página sin el producto
            }else{
                socket.emit("deleted",deleted)
                socket.broadcast.emit("deleted",deleted)//Esto solo es necesario si se quiere que todos los clientes reciban la actualaización de la página sin el producto

            }
            
        })
    })
}