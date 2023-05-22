import { Router } from 'express';
import passport from 'passport';
import controller from '../controllers/view.controller.js'
import { authorized } from '../middlewares/auth.middleware.js';

const route = Router();


route.get('/',controller.viewLogin)

route.get('/products',controller.viewProducts.bind(controller))

route.get("/products/:pid",controller.viewProduct.bind(controller));

route.get('/carts/:cid',controller.viewCart.bind(controller))

route.get('/realtimeproducts',passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized("Admin"), controller.viewRealTimeProducts.bind(controller))

route.get('/chat', passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized("Usuario"),controller.viewChat.bind(controller))

route.get('/register',controller.viewRegister)

route.get('/login',controller.viewLogin)

route.get("/perfil",passport.authenticate("current",{failureRedirect:"/unauthorized"}),controller.viewPerfil.bind(controller))

route.get('/restorepassword',controller.viewRestorePassword)

route.get("/unauthorized",controller.viewUnauthorized)

export default route;
