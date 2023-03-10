import { Router } from 'express';
import { ProductManager } from '../src/ProductManager.js';


const path = "./data/products.json";
const productManager = new ProductManager(path);

const route = Router();


route.get('/',async (req,res) => {

    const products =  await productManager.getProducts();
    
    res.render('index',{products: products})

})

route.get('/realtimeproducts', async(req,res) => {

    const products =  await productManager.getProducts();

    res.render("realTimeProducts",{products:products})
    

})



export default route;
