import  express  from 'express';
import { Router } from 'express';
import {usersModel} from "../src/dao/models/user.model.js"

const route = Router();
route.use(express.urlencoded({extended: true}));

route.post("/login",async (req,res)=>{
    
    const {email,password} = req.body;
    
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.user = email;
       return res.redirect("../../products");
    }
    
    const user = await usersModel.findOne({email,password});

    if(!user){
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
export default route