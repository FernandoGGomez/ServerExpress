import  express  from 'express';
import { Router } from 'express';
import passport from 'passport';
import controller from '../controllers/users.controller.js';
import { authorized } from '../middlewares/auth.middleware.js';

const route = Router();
route.use(express.urlencoded({extended: true}));

route.get("/",passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized("Admin"),controller.getAll.bind(controller))
route.post("/premium/:uid",controller.premiumUser.bind(controller))
route.delete("/",controller.delete.bind(controller))
route.delete("/:uid",passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized("Admin"),controller.deleteUser.bind(controller))

export default route