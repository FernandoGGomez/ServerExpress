import  express  from 'express';
import { Router } from 'express';
import { generateToken } from '../src/config/passport.config.js';
import {usersModel} from "../src/dao/models/user.model.js"
import { createHash, isValidPassword } from '../utils/crypto.js';
import passport from 'passport';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.post("/register",passport.authenticate("register",{session:false,failureRedirect:"/api/auth/failureregister"}), async (req,res)=>{

    console.log("req.body:",req.body)
    req.session.user = req.body.email
    
    res.status(201).redirect("../../products");


})

route.get("/failureregister",(req,res)=>{
    res.status(500).send({error:"Error en el registro"});
})

route.post("/login",passport.authenticate("login"), async (req,res)=>{
    const user = req.user
    console.log("user en login:",user)
    const token = generateToken({_id:user._id,email:user.email})
    res.cookie("AUTH",token,{
        maxAge: 60*60*1000*24,
        httpOnly: true
    })
    console.log("req.user:",user)
    res.redirect("../../products",);
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

        res.clearCookie("AUTH")
        res.redirect("/login")
        

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