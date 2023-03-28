import express from "express";
import { Router } from "express";
import cartManager from "../src/managers/cart.manager.js";
import productManager from "../src/managers/product.manager.js"

const route = Router();
route.use(express.urlencoded({extended: true}))

route.get("/:cid",async(req,res)=>{

    const {cid} = req.params;
    const cart = await cartManager.getCartById(cid);
    console.log("CART: ",cart)
    if(typeof(cart) !== "object"){
        return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
             
    }

    res.status(200).send({products:cart.cart})

})

route.post("/",async(req,res)=>{
    
    await cartManager.create()

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

     const productoCargado =   await cartManager.addProductToCart(cid,pid)

     if(productoCargado){
        res.status(200).send(cart)
     }
    
    
})

export default route;