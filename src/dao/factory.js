import { config } from "../../utils/configure.js";
import mongoose from "mongoose";
export class Factory{
    
   static async getDao(dao){
        switch(config.persistence){
            case "MONGO":
                mongoose.connect(config.mongo_url,{useNewUrlParser: true,useUnifiedTopology:true});
                
                switch(dao){
                    case "cart":
                        const {default: CartService} = await import('./services/cart.service.js');
                        return new CartService();
                    
                    case "products":
                        const {default: ProductService} = await import('./services/product.service.js')
                        return new ProductService();

                    case "users":
                        const {default: UsersService} = await import('./services/user.service.js')
                        return new UsersService();

                    case "ticket":
                        const {default: TicketService} = await import('./services/ticket.service.js')
                        return new TicketService();

                }
                
                break;
            
            case "FILE":
                switch(dao){
                    case "cart":
                        const {CartManager} = await import('../CartManager.js');
                        return new CartManager('carts.json');
                    
                    case "products":
                        const {ProductManager} = await import('../ProductManager.js');
                        return new ProductManager('products.json');

                    case "ticket":
                        console.log("TICKET")
                        return "hola"

                }
            default:
                console.log("DAO",dao)
                throw new Error("Wrong config")
        }

    }

}

