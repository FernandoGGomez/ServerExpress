import express from "express";
import { Router } from "express";
import cartController from "../src/controllers/cart.controller.js";
import controller from "../src/controllers/cart.controller.js";

const route = Router();
route.use(express.urlencoded({extended: true}))

route.get("/:cid",cartController.findOne.bind(cartController))

route.post("/",cartController.create.bind(cartController))

route.post("/:cid/product/:pid",cartController.addProductToCart.bind(cartController))

route.put("/:cid",cartController.update.bind(cartController))

route.put("/:cid/products/:pid",controller.updateQuantityOfProductInCart.bind(controller))

route.delete("/:cid/products/:pid",controller.deleteProduct.bind(controller))

route.delete("/:cid",controller.delete.bind(controller))


export default route;