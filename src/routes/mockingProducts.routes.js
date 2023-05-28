import express from "express";
import { Router } from "express";
import controller from "../controllers/mockingproducts.controller.js";

const route = Router();
route.use(express.urlencoded({extended: true}))

route.get("/",controller.create)

export default route;