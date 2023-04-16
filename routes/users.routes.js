import  express  from 'express';
import { Router } from 'express';
import {usersModel} from "../src/dao/models/user.model.js"
import { createHash } from '../utils/crypto.js';
import passport from 'passport';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.post("/setUser",passport.authenticate("register",{failureRedirect:"../auth/failureregister"}), async (req,res)=>{

            req.session.user = req.body.email
            res.status(201).redirect("../../products");


})

export default route