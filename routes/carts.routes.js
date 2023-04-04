import express from "express";
import { Router } from "express";
import cartManager from "../src/managers/cart.manager.js";
import productManager from "../src/managers/product.manager.js"
import { cartsModel } from "../src/dao/models/cart.model.js";
import req from "express/lib/request.js";

const route = Router();
route.use(express.urlencoded({extended: true}))

route.get("/:cid",async(req,res)=>{

    const {cid} = req.params;
    try{

        const cart = await cartsModel.find({_id:cid}).populate("cart.product");
        if (!cart) {
            throw new Error;
          }
          res.status(200).send({cart:cart[0].cart})
    }catch(error){
        return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
    }

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


route.put("/:cid",async(req,res)=>{

    const {cid} = req.params
  
    const product = req.body
    const requiredProps = ['product', 'quantity'];

    const isValid = product.every(prod => {
        const objKeys = Object.keys(prod);
        return objKeys.length === requiredProps.length && objKeys.every(prop => requiredProps.includes(prop));
      });

    if(isValid){
        const updatedCart = await cartManager.updateCart(cid,product)

    if (updatedCart){
        res.status(200).send("Carrito actualizado correctamente");
    }else{
        res.status(500).send("No se pudo actualizar el carrito")
    }

    }
    else{
        res.status(500).send("No se pudo actualizar el carrito")
    }
})



route.put("/:cid/products/:pid",async(req,res)=>{

    const {cid,pid} = req.params; 
    const quantity = req.body.quantity;

    if(!isNaN(Number(quantity))){

        const data = {product:pid,quantity:Number(quantity)}
        const cart = await cartManager.getCartById(cid);

        if(!cart){

            return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
             
        }

        const productoFiltrado =  await productManager.getProductById(pid);
        if(typeof(productoFiltrado) !== "object"){

            return res.status(400).send({Error: `El Producto con el id ${pid} no existe`}) 

        }

        try{
            await cartManager.updateProductInCart(cid,data)

            res.send(`Producto ${pid} actualizado con la cantidad ${quantity}`)
        }catch(error){
            res.status(404).send({"Error":`El carrito con el id ${cid} no existe`})
        }
    }else{

        res.status(400).send({"Error":"Solo se puede modificar la propiedad quantity y solo puede recibir un valor numérico"})
    }
    
})




route.delete("/:cid/products/:pid",async(req,res)=>{

    const {cid,pid} = req.params; 

    const cart = await cartManager.getCartById(cid);
    if(typeof(cart) !== "object"){

        return res.status(400).send({error:`El carrito con el id ${cid} no existe`})
             
    }

    const productoFiltrado =  await productManager.getProductById(pid);
    if(typeof(productoFiltrado) !== "object"){

        return res.status(400).send({Error: `El Producto con el id ${pid} no existe`}) 

    }

        const productoEliminado =   await cartManager.deleteProduct(cid,pid)

     if(productoEliminado){
        res.status(200).send(cart)
     }else{
        res.status(400).send({Error:"No se puede eliminar"})
     }



})

route.delete("/:cid",async (req,res) => {

        const {cid} = req.params;

        await cartManager.updateCart(cid,[])

        res.status(200).send("Carrito vaciado correctamente")

})


export default route;