import  express  from 'express';
import { Router } from 'express';
import {usersModel} from "../src/dao/models/user.model.js"
import { createHash } from '../utils/crypto.js';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.post("/setUser",async (req,res)=>{
    
    const usuario = req.body;
    const hashedPassword = createHash(usuario.password)
    const alreadyExist = await usersModel.findOne({email:req.body.email})

    if(alreadyExist){
        return res.status(409).send({error:"Ese email ya tiene un usuario creado"})
    }
        try{    

            const {_id } = await usersModel.create({...usuario,password:hashedPassword});
            const {email} = req.body
        
            req.session.user = email
            res.status(201).redirect("../../products");

        }catch(error){

            res.status(500).send("Error del servidor")
        }

})

export default route