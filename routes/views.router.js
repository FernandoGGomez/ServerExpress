import { Router } from 'express';
import passport from 'passport';
import controller from '../src/controllers/view.controller.js'

const route = Router();


route.get('/',controller.viewLogin)

route.get('/products',controller.viewProducts.bind(controller))

route.get("/products/:pid",controller.viewProduct.bind(controller));

route.get('/carts/:cid',controller.viewCart.bind(controller))

route.get('/realtimeproducts', controller.viewRealTimeProducts.bind(controller))

route.get('/chat', controller.viewChat.bind(controller))

route.get('/register',controller.viewRegister)

route.get('/login',controller.viewLogin)

route.get("/perfil",passport.authenticate("current"),controller.viewPerfil.bind(controller))

route.get('/restorepassword',controller.viewRestorePassword)

export default route;
