import UserService from "../dao/services/user.service.js";
import { generateToken } from '../config/passport.config.js';
import { createHash } from '../utils/crypto.js';
import { logger } from "../logger/winston-logger.js";
import { Factory } from "../dao/factory.js";
class UserController{

    #userService;
    #cartService;
    constructor(userService,cartService){
        this.#userService = userService;
        this.#cartService = cartService;

    }
    
    async register(req,res,next){

        const user = req.user
        const token = generateToken({_id:user._id,email:user.email})
        res.cookie("AUTH",token,{
            maxAge: 60*60*1000*24,
            httpOnly: true
        })
        try{
            const cart = await this.#cartService.create()
            await this.#userService.updateOne({_id:user._id},{cart:cart._id})
            res.redirect("../../products",);
        }catch(error){
            next(error);
        }
        
    
    }

    failureRegister(req,res){
        res.status(500).send({error:"Error en el registro"});
    }

    async login(req,res){
        const user = req.user
        const token =  generateToken({_id:user._id,email:user.email})
        res.cookie("AUTH",token,{
            maxAge: 60*60*1000*24,
            httpOnly: true
        })
        res.redirect("../../products",);
    }

    async failurelogin(req,res){
        res.status(401).send({error:"Usuario o contraseña incorrectos"});
    }

    async githubCallback(req,res){
        req.session.user = req.user.email
        res.redirect("../../products")
    }

    async logout(req,res){

        res.clearCookie("AUTH")
        req.user = false
        res.status(200).redirect("/login")
    }

    async restorePassword(req,res){
        const {email,newPassword} = req.body
    
        try{
            await this.#userService.findOne({email:email})
            const hashedPassword = createHash(newPassword)
    
           try{
            await this.#userService.updateOne({email:email},{password:hashedPassword})
        
            req.session.user = email
            
            res.status(200).redirect("/login")
           }catch(error){
            logger.error(error)
            return res.status(500).send({error:"Internal server error"})
           }
           


        }catch(error){
            logger.error("No existe un usuario con ese email en la base de datos")
            return res.status(404).send({error:"No existe un usuario con ese email en la base de datos"})
        }
           

    }

    async premiumUser(req,res,next){

        const uid = req.params.uid;       

        try{
            const user = await this.#userService.findOne({_id:uid})
            const rol = user.rol;

            if(rol === "Usuario"){

                const updatedUser = await this.#userService.updateOne({_id:uid},{rol:"premium"})
                res.status(200).send({user:updatedUser})
            }else if(rol === "premium"){
        
                const updatedUser = await this.#userService.updateOne({_id:uid},{rol:"Usuario"})
                res.status(200).send({user:updatedUser})
            }else{
                     res.status(400).send({error:"Un admin no puede ser premium"})
            }

        }catch(error){
            next(error)
        }

    }

}

const controller = new UserController(await Factory.getDao("users"), await Factory.getDao("cart"));

export default controller;