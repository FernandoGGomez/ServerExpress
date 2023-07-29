import  express  from 'express';
import { Router } from 'express';
import passport from 'passport';
import controller from '../controllers/users.controller.js';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.post("/register",passport.authenticate("register",{session:false,failureRedirect:"/api/auth/failureregister"}),passport.authenticate("login"),  controller.register.bind(controller))

route.get("/failureregister",controller.failureRegister)

route.post("/login",passport.authenticate("login"), controller.login)

route.get("/failurelogin",controller.failurelogin)

route.get("/github",passport.authenticate("github", {scope:["user:email"]}),(req,res)=>{})

route.get("/github-callback",passport.authenticate("github" ,{failureRedirect:"/login"}),controller.githubCallback)

route.post("/logout",controller.logout)

route.post("/restorepassword",controller.restorePassword.bind(controller))

route.post("/premium/:uid",controller.premiumUser.bind(controller))

export default route