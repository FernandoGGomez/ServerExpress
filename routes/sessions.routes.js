import  express  from 'express';
import { Router } from 'express';
import passport from 'passport';


const route = Router();
route.use(express.urlencoded({extended: true}));


route.get("/current",passport.authenticate("current",{failureRedirect:"/api/sessions/unauthorized"}),(req,res)=>{

    res.send({usuario:req.user})

})

route.get("/unauthorized",(req,res)=>{

    res.render("unauthorized")

})

export default route