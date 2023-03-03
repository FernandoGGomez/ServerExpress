import express from "express";
import { Router } from "express";
import { CartManager } from "../src/CartManager.js";
import { ProductManager } from '../src/ProductManager.js';

const route = Router();
route.use(express.urlencoded({extended: true}))

const path = "carts.json";
const pathProducts = "products.json";
const cartManager = new CartManager(path) //genero una nueva instancia de la clase CartManager
const productManager = new ProductManager(pathProducts) //genero una nueva instancia de la clase ProductManager

route.get("/:cid",async(req,res)=>{

    const {cid} = req.params;
    const cart = await cartManager.getCartById(cid);

    if(typeof(cart) !== "object"){
        return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
             
    }

    res.status(200).send({products:cart.products})

})

route.post("/",async(req,res)=>{
    
    await cartManager.createCart()

    res.status(200).send({ok:"true",message:"Carrito creado correctamente"})
    
})

route.post("/:cid/product/:pid",async(req,res)=>{

    const {cid,pid} = req.params; 

    const cart = await cartManager.getCartById(cid);
    if(typeof(cart) !== "object"){

        return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
             
    }

    const productoFiltrado =  await productManager.getProductById(pid);
    if(typeof(productoFiltrado) !== "object"){

        return res.status(400).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

    await cartManager.addProductToCart(cid,pid)

    res.status(200).send(cart)
    
})

export default route;