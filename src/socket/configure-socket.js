import { Server } from "socket.io";
import productManager from "../managers/product.manager.js"
import chatManager from "../managers/chat.manager.js"
import ProductService from "../dao/services/product.service.js";

const productServ = new ProductService();
export default function configureSocket(httpServer){
   const socketServer = new Server(httpServer);
    
   socketServer.on("connection",(socket)=>{

     
        console.log("socket conectado")
        socket.on("add_product",async (product)=>{
           try{
                  await productServ.create(product)
                 socket.emit("producto_agregado",product)
                 socket.broadcast.emit("producto_agregado",product)//Esto solo es necesario si se quiere que todos los clientes reciban la actualaización del producto
           }catch(error){
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