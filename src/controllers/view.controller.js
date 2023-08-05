import CartService from "../dao/services/cart.service.js";
import UserService from "../dao/services/user.service.js"
import chatManager from "../managers/chat.manager.js"
import ProductService from "../dao/services/product.service.js";
import { logger } from "../logger/winston-logger.js";

class viewController{
    #CartService
    #UserService
    #ProductService
    constructor(CartService,UserService,ProductService){
        this.#CartService = CartService
        this.#UserService = UserService
        this.#ProductService = ProductService
    }

    async viewCart(req,res,next){
        

    const {cid} = req.params;

    try{

        const cart = await this.#CartService.findById(cid);

        res.status(200).render("cart",{cart:JSON.parse(JSON.stringify(cart.cart))})
    }catch(error){
        return res.status(200).render("cart",{cartError:true,cid:cid})
    }

    }


    async viewPerfil(req,res,next){
        try{
            const email = req.user.email
    
            if(!email){
                return res.render("perfil",{
                    status:false,
                })
            }
            const user = await this.#UserService.findOne({email})
            res.status(200).render("perfil",{
                status:true,
                name: user.name,
                last_name: user.last_name,
                age: user.age,
                email: user.email
            })
        }catch(error){
            console.log(error)
            res.status(403).render("unauthorized")
        }
    }


    async viewProducts(req,res,next){

    const email = req.cookies.AUTH ? req.user?.email || false : false;
    const query = req.query;
    const limit =  !isNaN(query.limit) ?  query.limit : 10;
    const page = query.page ? query.page : 1;
    const sort = query.sort ==="asc" ? 1: query.sort ==="desc"?-1 : "";
    const category = query.category
    const status = query.status == "true" ? query.status : query.status == "false" ? query.status : 1;

    console.log("EMAIL:",email)

    let errorPage;
    let errorPage2;
    let errorStatus;

    const products =  await this.#ProductService.findAll(limit,page,sort,category,status);
     

       if(  status !== "true" && status !== "false" && status !== 1){
            errorStatus = true
       }else{
        errorStatus = false
       }
       if(page > products.totalPages ){
            errorPage = true
       }else if(isNaN(page)){

            errorPage2 = true
            

       }
       if(!email){
       return res.status(200).render("products",{
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
    }else{
           
        res.status(200).render("products",{
            name: req.user.name,
            rol: req.user.rol,
            email:req.user.email,
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
    }
    }

    async viewProduct(req,res,next){
        
    const {pid} = req.params;
        try{
            const productoFiltrado =  await this.#ProductService.findById(pid);
     

            res.status(200).render("product",{product:JSON.parse(JSON.stringify(productoFiltrado))})
        }catch{
            logger.error(`El Producto con el id ${pid} no existe`)
            return res.status(404).send({Error: `El Producto con el id ${pid} no existe`})
        }
    
  
    }

    async viewRealTimeProducts(req,res,next){
        
        try{
            const products =  await this.#ProductService.findAllProducts();
            res.status(200).render("realTimeProducts",{products:JSON.parse(JSON.stringify(products))})
        }catch(error){
            next(error)
        }
            
   
    }

    async viewChat(req,res,next){

        try{
            const chat =  await chatManager.getAll();
            res.status(200).render("chat",{chat:chat})
        }catch(error){
            next(error)
        }
        
    }

    async viewRegister(req,res){

        res.status(200).render("register")
    
    }

    async viewLogin(req,res){

        res.status(200).render("login")
    
    }

    async viewRestorePassword(req,res){

        res.status(200).render("restorePassword")
    
    }

    async viewUnauthorized(req,res){

        res.status(403).render("unauthorized")
    
    }

}

const controller = new viewController(new CartService(), new UserService(), new ProductService());
export default controller;