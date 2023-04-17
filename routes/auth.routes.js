import  express  from 'express';
import { Router } from 'express';
import {usersModel} from "../src/dao/models/user.model.js"
import { createHash, isValidPassword } from '../utils/crypto.js';
import passport from 'passport';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.get("/failureregister",(req,res)=>{
    res.status(500).send({error:"Error en el registro"});
})

route.post("/login",passport.authenticate("login",{failureRedirect:"/api/auth/failurelogin"}), async (req,res)=>{
    
    req.session.user = req.user.email;
    res.redirect("../../products");

})

route.get("/failurelogin",(req,res)=>{
    res.status(401).send({error:"Usuario o contraseña incorrectos"});
})

route.get("/github",passport.authenticate("github", {scope:["user:email"]}),(req,res)=>{

})

route.get("/github-callback",passport.authenticate("github" ,{failureRedirect:"/login"}),(req,res)=>{
    req.session.user = req.user.email
    console.log("req.user:",req.user.email)
    res.redirect("../../products")
})

route.post("/logout",(req,res)=>{

    req.session.destroy((err)=>{
        if(err){
            res.status(500).send({error: err})
        }else{
            res.redirect("/login")
        }
    })

})
route.post("/restorepassword",async (req,res)=>{
    const {email,newPassword} = req.body

    try{
        const user = await usersModel.findOne({email})

        if(!user){
            return res.status(404).send({error:"No existe un usuario con ese email en la base de datos"})
        }
    }catch(error){
        console.log(error)
        return res.status(500).send({error:"Internal server error"})
    }
       

    const hashedPassword = createHash(newPassword)

    await usersModel.updateOne({email},{$set :{password:hashedPassword}})

    req.session.user = email
    res.status(200).redirect("../../perfil")
})
export default route