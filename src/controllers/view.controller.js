import CartService from "../services/cart.service.js";
import productManager from "../managers/product.manager.js"
import UserService from "../services/user.service.js"
import chatManager from "../managers/chat.manager.js"
import ProductService from "../services/product.service.js";

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
        console.log("cariiiito:",cart)
     
          res.render("cart",{cart:JSON.parse(JSON.stringify(cart.cart))})
    }catch(error){
        return res.render("cart",{cartError:true,cid:cid})
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
            res.render("perfil",{
                status:true,
                name: user.name,
                last_name: user.last_name,
                age: user.age,
                email: user.email
            })
        }catch(error){
            next(error)
        }
    }


    async viewProducts(req,res,next){
        
    const email = req.user.email
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
       return res.render("products",{
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
        const user = await this.#UserService.findOne({email})
        console.log("USER: ",user)
       if(user){ 
        
        res.render("products",{
            name: user.name,
            rol: user.rol,
            email:user.email,
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
        res.render("products",{
            rol: "admin",
            email:email,
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
    }

    async viewProduct(req,res,next){
        
    const {pid} = req.params;

    const productoFiltrado =  await this.#ProductService.findById(pid);
    console.log(productoFiltrado)
    if(!productoFiltrado){

        return res.status(404).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

    
    console.log("PeoductoFiltrado",productoFiltrado) 
    res.render("product",{product:JSON.parse(JSON.stringify(productoFiltrado))})
  
    }

    async viewRealTimeProducts(req,res,next){
        
        try{
            const products =  await productManager.getProducts();
            res.render("realTimeProducts",{products:products})
        }catch(error){
            next(error)
        }
            
   
    }

    async viewChat(req,res,next){

        try{
            const chat =  await chatManager.getAll();
            res.render("chat",{chat:chat})
        }catch(error){
            next(error)
        }
        
    }

    async viewRegister(req,res){

        res.render("register")
    
    }

    async viewLogin(req,res){

        res.render("login")
    
    }

    async viewRestorePassword(req,res){

        res.render("restorePassword")
    
    }
}

const controller = new viewController(new CartService(), new UserService(), new ProductService());
export default controller;