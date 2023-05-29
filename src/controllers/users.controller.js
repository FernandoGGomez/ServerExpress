import UserService from "../dao/services/user.service.js";
import { generateToken } from '../config/passport.config.js';
import { createHash } from '../../utils/crypto.js';
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
        console.log("user en login:",user)
        const token =  generateToken({_id:user._id,email:user.email})
        console.log(token)
        res.cookie("AUTH",token,{
            maxAge: 60*60*1000*24,
            httpOnly: true
        })
        console.log("req.user:",user)
        res.redirect("../../products",);
    }

    async failurelogin(req,res){
        res.status(401).send({error:"Usuario o contraseña incorrectos"});
    }

    async githubCallback(req,res){
        req.session.user = req.user.email
        console.log("req.user:",req.user.email)
        res.redirect("../../products")
    }

    async logout(req,res){
        console.log("req.user:",req.user)

        res.clearCookie("AUTH")
        req.user = false
        console.log("req.userfalse:",req.user)
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
            console.log(error)
            return res.status(500).send({error:"Internal server error"})
           }
           


        }catch(error){
            console.log(error)
            next(new CustomError({
                name:"User doesn't exist",
                cause:`There is no user with that email in the database`,
                message:`There is no user with that email in the database`,
                code:404
            }))
        }
           
        
    }

}

const controller = new UserController(new UserService);

export default controller;