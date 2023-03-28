import { Server } from "socket.io";
import productManager from "../src/managers/product.manager.js"
import chatManager from "../src/managers/chat.manager.js"
export default function configureSocket(httpServer){
   const socketServer = new Server(httpServer);
    
   socketServer.on("connection",(socket)=>{

     
        console.log("socket conectado")
        socket.on("add_product",async (product)=>{
           
           
            const productoAgregado = await productManager.addProduct(product)
          
           
            if(productoAgregado){
                
                const allProducts = await productManager.getProducts()
              
                const productId = allProducts.find(prod => prod.title === productoAgregado.title)
           
                const nuevoProducto = await productManager.getProductById(productId._id)

                if(nuevoProducto){
                    console.log("nuevoProducto: ",nuevoProducto)
                }
                
    
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
                console.log("Deleted true: ",deleted)
                socket.emit("deleted",deleted)
                socket.broadcast.emit("deleted",deleted)//Esto solo es necesario si se quiere que todos los clientes reciban la actualaización de la página sin el producto
            }else{
                console.log("Deleted false: ",deleted)
                socket.emit("deleted",deleted)
                socket.broadcast.emit("deleted",deleted)//Esto solo es necesario si se quiere que todos los clientes reciban la actualaización de la página sin el producto

            }
            
        })

        socket.on("sendMessage",async(userMessage)=>{

            await chatManager.create(userMessage)

            socket.emit("mensajeEnviado",userMessage)
            socket.broadcast.emit("mensajeEnviado",userMessage)
            console.log("Mensaje guardado")

        })
    })
}