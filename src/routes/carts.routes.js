import express from "express";
import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import controller from "../controllers/cart.controller.js";
import { authorized } from '../middlewares/auth.middleware.js';
import passport from 'passport';


const route = Router();
route.use(express.urlencoded({extended: true}))

route.get("/:cid",cartController.findOne.bind(cartController))

route.post("/",cartController.create.bind(cartController))

route.post("/:cid/product/:pid",passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized("Usuario"),cartController.addProductToCart.bind(cartController))

route.put("/:cid",cartController.update.bind(cartController))

route.put("/:cid/products/:pid",controller.updateQuantityOfProductInCart.bind(controller))

route.delete("/:cid/products/:pid",controller.deleteProduct.bind(controller))

route.delete("/:cid",controller.delete.bind(controller))

route.post("/:cid/purchase",controller.purchase.bind(controller))


export default route;