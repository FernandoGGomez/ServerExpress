import UserService from "../dao/services/user.service.js";
import { generateToken } from '../config/passport.config.js';
import { createHash } from '../utils/crypto.js';
import { logger } from "../logger/winston-logger.js";
import { Factory } from "../dao/factory.js";
import { UsersDto } from "../dao/DTOs/user.dto.js";
import { inactiveAccount } from "../mailing/inactiveAccount.js";
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

    async login(req,res,next){
        const user = req.user
        const token =  generateToken({_id:user._id,email:user.email})
        if(user._id != 1){
            try{
                await this.#userService.updateOne({_id:user._id},{last_connection:new Date()})
            }catch(error){
                next(error);
            }
            
            res.cookie("AUTH",token,{
                maxAge: 60*60*1000*24,
                httpOnly: true
            })
            res.redirect("../../products",);
        }else{
            res.cookie("AUTH",token,{
                maxAge: 60*60*1000*24,
                httpOnly: true
            })
            res.redirect("../../products",);
        }
        
    }

    async failurelogin(req,res){
        res.status(401).send({error:"Usuario o contraseña incorrectos"});
    }

    async githubCallback(req,res,next){
        try{
            const user = await this.#userService.findOne({email:req.user.email})
            if(req.user?.cart.toString() != "{}"){
                try{
                    await this.#userService.updateOne({_id:user._id},{last_connection:new Date()})
                    const token = generateToken({_id:user._id,email:user.email})
                    res.cookie("AUTH",token,{
                    maxAge: 60*60*1000*24,
                    httpOnly: true
                    
                })
                return  res.redirect("../../products");
                }catch(error){
                    next(error)
                }
            }
               
            try{
                const cart = await this.#cartService.create()
                await this.#userService.updateOne({_id:user._id},{last_connection:new Date()})
                await this.#userService.updateOne({_id:user._id},{cart:cart._id})   
                req.session.user = req.user.email
                res.redirect("../../products");
            }catch(error){
                next(error);
            }
        
        }catch(error){
            next(error)
        }
        
       
        
    }

    async logout(req,res,next){
        res.clearCookie("AUTH")
        res.clearCookie("connect.sid")
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
        const userEmail = req.user.email;
        try{
            const user = await this.#userService.findOne({_id:uid})
            const rol = user.rol;
            if(user.email === userEmail || userEmail === "adminCoder@coder.com"){
                if(rol === "Usuario"){

                    const updatedUser = await this.#userService.updateOne({_id:uid},{rol:"premium"})
                    res.status(200).send({user:updatedUser})
                }else if(rol === "premium"){
            
                    const updatedUser = await this.#userService.updateOne({_id:uid},{rol:"Usuario"})
                    res.status(200).send({user:updatedUser})
                }else{
                            res.status(400).send({error:"Un admin no puede ser premium"})
                }
            }else{
                res.status(401).send({error:"No tienes los permisos para modificar el rol de otro usuario"})
            } 
            

        }catch(error){
            res.status(400).send({error:`El usuario con el id ${uid} no existe`})
        }        

    }

    async getAll(req,res,next){
        try{
            const users =  await this.#userService.findAll();
            const usersDto = users.map(u => new UsersDto(u)) 
            res.status(200).send({users:usersDto});
        }catch{
            res.status(404).send({error:"No hay usuarios en la base de datos"})
        }
    }

    async delete(req,res,next){
        try{
            const users =  await this.#userService.findAll();
            if(users.length > 0){
                const currentDate = new Date();                    
                const usersToDelete =  users.map( async (u) => {
                    
                    const differenceInMilliseconds = currentDate - u.last_connection ;
                    const differenceInMinutes = differenceInMilliseconds / 1000 / 60
                    const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24;
                    
            
                    if(differenceInMinutes > 1){
                        inactiveAccount(u.email); //envió un email avisando al usuario que eliminamos su cuenta
                        const eliminatedUser =  await this.#userService.delete(u._id);
                        return eliminatedUser
                    }})
                    const usersDeletedResults = await Promise.all(usersToDelete);
                    const usersDeleted = usersDeletedResults.filter((u)  => u != null  );
                    res.status(200).send({usersDeleted: usersDeleted})
            }else{
                res.status(400).send({error:"No hay usuarios en la base de datos"})
            }
            
        }catch(error){
            res.status(404).send({error:"No hay usuarios para eliminar"})
        }
    }

    async deleteUser(req,res,next){

        const uid = req.params.uid;
        try{
            await this.#userService.delete(uid)
            res.status(200).send({ok:"Usuario eliminado correctamente"})
        }catch{
            res.status(404).send({error:"No existe ese usuario en la base de datos"})
        }

    }

}

const controller = new UserController(await Factory.getDao("users"), await Factory.getDao("cart"));

export default controller;