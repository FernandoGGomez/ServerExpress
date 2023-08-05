import  express  from 'express';
import { Router } from 'express';
import { uploader } from '../utils/uploader.js';
import productController from '../controllers/products.controller.js';
import passport from 'passport';
import { authorized } from '../middlewares/auth.middleware.js';

const route = Router();

route.use(express.urlencoded({extended: true}))

route.get("/",productController.findAll.bind(productController))

route.get("/:pid",productController.findOne.bind(productController));

route.post("/",passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized(["Admin","premium"]),uploader.single("thumbnail"),productController.create.bind(productController))

route.put("/",passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized(["Admin","premium"]),productController.updateError)

route.put("/:pid",passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized(["Admin","premium"]),productController.update.bind(productController))

route.delete("/:pid",passport.authenticate("current",{failureRedirect:"/unauthorized"}),authorized(["Admin","premium"]),productController.delete.bind(productController))

export default route;
