import UserService from "../dao/services/user.service.js";
import { generateToken } from '../config/passport.config.js';
import { createHash } from '../utils/crypto.js';
import { logger } from "../logger/winston-logger.js";
class UserController{

    #service;
    constructor(service){
        this.#service = service;
    }
    
    async register(req,res){

        const user = req.user
        console.log("user en register:",user)
        const token = generateToken({_id:user._id,email:user.email})
        res.cookie("AUTH",token,{
            maxAge: 60*60*1000*24,
            httpOnly: true
        })
        console.log("req.user:",user)
        res.redirect("../../products",);
    
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
            await this.#service.findOne(email)
    
            const hashedPassword = createHash(newPassword)
    
           try{
            await this.#service.updateOne(email,hashedPassword)
        
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

}

const controller = new UserController(new UserService);

export default controller;