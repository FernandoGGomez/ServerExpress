import chatManager from "../managers/chat.manager.js"
import { Factory } from "../dao/factory.js";
import { logger } from "../logger/winston-logger.js";
import { hbs } from "../app.js";

class viewController{
    #cartService
    #userService
    #productService
    constructor(cartService,userService,productService){
        this.#cartService = cartService
        this.#userService = userService
        this.#productService = productService
    }

    async viewCart(req,res,next){
        
    const userEmail = req?.user?.email;
    const {cid} = req.params;

    try{
        const user = await this.#userService.findOne({email:userEmail});
        if(user.cart.toString() === `new ObjectId("${cid}")`){
            try{

                const cart = await this.#cartService.findById(cid);
                if(cart.cart.length === 0){
                    return res.status(200).render("cart",{empty:true})
                }
                const totalPrice = cart.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
                res.status(200).render("cart",{cart:JSON.parse(JSON.stringify(cart.cart)),totalPrice:totalPrice,cid:cid})
            }catch(error){
                console.log(error)
                return res.status(404).render("cart",{cartError:true,cid:cid})
            }
        }else{
            res.status(401).render("unauthorized",{error:"No tienes los permisos para acceder a este carrito"})
        }
    }catch{
        res.status(404).render("unauthorized",{error:"No tienes los permisos para acceder a este carrito"})
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
            const user = await this.#userService.findOne({email})
            res.status(200).render("perfil",{
                status:true,
                name: user.name,
                last_name: user.last_name,
                age: user.age,
                email: user.email
            })
        }catch(error){
            res.status(403).render("unauthorized",{error:"No tienes los permisos para acceder a esta página"})
        }
    }


    async viewProducts(req,res,next){
console.log("llega aca",req.user)
    const email = req.cookies.AUTH || req.user?.email || false ;
    const query = req.query;
    const limit =  !isNaN(query.limit) ?  query.limit : 10;
    const page = query.page ? query.page : 1;
    const sort = query.sort ==="asc" ? 1: query.sort ==="desc"?-1 : "";
    const category = query.category
    const status = query.status == "true" ? query.status : query.status == "false" ? query.status : 1;
        console.log(email)
    let errorPage;
    let errorPage2;
    let errorStatus;

    const products =  await this.#productService.findAll(limit,page,sort,category,status);
     

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
            const productoFiltrado =  await this.#productService.findById(pid);
            const buyer = await this.#userService.findOne({email:req.user.email})
            
            res.status(200).render("product",{product:JSON.parse(JSON.stringify(productoFiltrado)),buyer:JSON.parse(JSON.stringify(buyer))})
        }catch{
            logger.error(`El Producto con el id ${pid} no existe`)
            return res.status(404).send({Error: `El Producto con el id ${pid} no existe`})
        }
    
  
    }

    async viewRealTimeProducts(req,res,next){
        
        try{
            const products =  await this.#productService.findAllProducts();
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

        res.status(403).render("unauthorized",{error:"No tienes los permisos para acceder a esta página"})
    
    }

    async viewAdminUsers(req,res){
        try{
            const users = await this.#userService.findAll()
            res.status(200).render("adminUsers",{users:JSON.parse(JSON.stringify(users)),helpers: { isPremium: hbs.helpers.isPremium }})
        }catch(error){
            console.log(error)
            res.render("notUsers")
        }
    }

}

const controller = new viewController(await Factory.getDao("cart"), await Factory.getDao("users"), await Factory.getDao("products"));
export default controller;