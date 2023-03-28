import express from "express";
import { Router } from "express";

const route = Router();
route.use(express.urlencoded({extended: true}))

route.get("/",async(req,res)=>{

res.send("HOLA")

})



// export default route;