import  express  from 'express';
import { Router } from 'express';
import {usersModel} from "../src/dao/models/user.model.js"

const route = Router();
route.use(express.urlencoded({extended: true}));

route.post("/setUser",async (req,res)=>{
    
    const usuario = req.body;
    try{    

        const {_id } = await usersModel.create(usuario);
        const {email} = req.body
        req.session.user = email
        res.status(201).redirect("../../products");

    }catch(error){

        res.status(500).send("Error del servidor")
    }

})

export default route