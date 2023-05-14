import  express  from 'express';
import { Router } from 'express';
import { uploader } from '../uploader.js';
import productController from '../src/controllers/products.controller.js'

const route = Router();

route.use(express.urlencoded({extended: true}))

route.get("/",productController.findAll.bind(productController))

route.get("/:pid",productController.findOne.bind(productController));

route.post("/",uploader.single("thumbnail"),productController.create.bind(productController))

route.put("/",productController.updateError)

route.put("/:pid",productController.update.bind(productController))

route.delete("/:pid",productController.delete.bind(productController))

export default route;
