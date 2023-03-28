import { Router } from 'express';
import productManager from "../src/managers/product.manager.js"
import chatManager from "../src/managers/chat.manager.js"


const route = Router();


route.get('/',async (req,res) => {

    const products =  await productManager.getProducts();
    
    res.render('index',{products: products})

})

route.get('/realtimeproducts', async(req,res) => {

    const products =  await productManager.getProducts();
    res.render("realTimeProducts",{products:products})
    

})

route.get('/chat', async(req,res) => {
    const chat =  await chatManager.getAll();
    res.render("chat",{chat:chat})

})
export default route;
