import  express  from 'express';
import { Router } from 'express';
import {usersModel} from "../src/dao/models/user.model.js"
import { createHash, isValidPassword } from '../utils/crypto.js';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.post("/login",async (req,res)=>{
    
    const {email,password} = req.body;
    
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.user = email;
       return res.redirect("../../products");
    }
    
    const user = await usersModel.findOne({email});

    if(!user || !isValidPassword(password,user.password)){
        return res.status(401).send({error: "email o contraseña incorrectos"})
    }

    req.session.user = email;
    res.redirect("../../products");

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