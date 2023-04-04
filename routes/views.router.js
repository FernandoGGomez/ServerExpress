import { Router } from 'express';
import productManager from "../src/managers/product.manager.js"
import chatManager from "../src/managers/chat.manager.js"
import { productsModel } from '../src/dao/models/products.model.js';
import { cartsModel } from "../src/dao/models/cart.model.js";




const route = Router();


route.get('/',async (req,res) => {

    const products =  await productManager.getProducts();
    
    res.render('index',{products: products})

})

route.get('/products',async(req,res)=>{

    const query = req.query;
    const limit =  !isNaN(query.limit) ?  query.limit : 10;
    const page = query.page ? query.page : 1;
    const sort = query.sort ==="asc" ? 1: query.sort ==="desc"?-1 : "";
    const category = query.category
    const status = query.status == "true" ? query.status : query.status == "false" ? query.status : undefined

    let errorPage;
    let errorPage2;
    let errorStatus;
        const products =  await productsModel.paginate(category && status?{category:category,status:status}:category?{category:category}:status?{status:status}:{},{limit:limit,page:page,sort:{price:sort},lean:true});
       console.log("prevLink: ",products)

       if(typeof status == "undefined"){
            errorStatus = true
       }
       if(page > products.totalPages ){
            errorPage = true
       }else if(isNaN(page)){

            errorPage2 = true
            

       }
        res.render("products",{
            products:products.docs,
            pages: products.totalPages,
            page: products.page,
            prev: products.prevPage,
            next: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage?"linkPrev" :null,
            nextLink:products.hasNextPage?"linkNext" :null ,
            errorPage: errorPage,
            errorPage2: errorPage2,
            errorStatus:  errorStatus
        });


})


route.get('/carts/:cid',async(req,res)=>{

    const {cid} = req.params;

    try{

        const cart = await cartsModel.find({_id:cid}).populate("cart.product");
        console.log("CART: ",JSON.parse(JSON.stringify(cart[0].cart)))
        if (!cart) {
            throw new Error;
          }
          res.render("cart",{cart:JSON.parse(JSON.stringify(cart[0].cart))})
    }catch(error){
        return res.render("cart",{cartError:true,cid:cid})
    }

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
