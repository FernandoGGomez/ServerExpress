import  express  from 'express';
import { Router } from 'express';
import passport from 'passport';


const route = Router();
route.use(express.urlencoded({extended: true}));


route.get("/current",passport.authenticate("current",{failureRedirect:"/unauthorized"}),(req,res)=>{

    res.send({usuario:req.user})

})

export default route