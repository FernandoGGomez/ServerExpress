import mongoose from "mongoose";
import { cartsModel } from "../models/cart.model.js"
class CartService{
    #model;
    constructor(){
        this.#model = cartsModel;
    }

    async create(data){
        return this.#model.create(data);
    }

    async findById(id){
        const cart = await this.#model.findById(id).populate("cart.product");
        return cart
    }

    async updateQuantity(id,data){
       const cart = await this.#model.findById(id);
       const productIndex = JSON.parse(JSON.stringify(cart)).cart.findIndex(e => e.product === data.product)
       if(productIndex !== -1){
        cart.cart[productIndex] = {...cart.cart[productIndex],...data}
        return await this.#model.updateOne({_id:id},{cart: cart.cart})
       }
       return  await this.#model.updateOne({_id:id}, {$push: {cart:{product:data.product,quantity:1}}});
           
    }

    async update(id,data){
        const pid = data[0].product 
        const cart = await this.#model.findById(id)        
        const productIndex = JSON.parse(JSON.stringify(cart.cart)).findIndex(prod => prod.product === pid)

        if(productIndex !== -1){
            cart.cart[productIndex] = {...cart.cart[productIndex],...data[0]}
            return await this.#model.updateOne({_id:id},{cart: cart.cart})
        }else{
            return this.#model.updateOne({_id:id},{$push:{cart:{product:data[0].product,quantity:data[0].quantity}}})       
        }
    }

    async addProduct(cid,pid){

        const cart =await this.findById(cid)
        const productIndex =  JSON.parse(JSON.stringify(cart.cart)).findIndex(prod => prod.product._id === pid);
       
        if(productIndex !== -1){
             const quantity = JSON.parse(JSON.stringify(cart.cart[productIndex].quantity + 1));
             const updatedData = {product:pid,quantity:quantity}
             const updatedCart = cart.cart[productIndex] = {...cart.cart[productIndex],...updatedData}
            return this.#model.updateOne({_id:cid},{$set:{cart:updatedCart.__parentArray}});
        }
  
            return this.#model.updateOne({_id:cid},{$push:{cart:{product:pid,quantity:1}}})
        
        
    }

    async delete(id){
        return this.#model.findByIdAndDelete(id);
    }

    async emptyCart(id){
        return this.#model.updateOne({_id:id},{$set:{cart:[]}})
    }

    async deleteProduct(id,pid){
        const cart = await this.#model.findById(id);
        try{
            const filteredCart = JSON.parse(JSON.stringify(cart.cart.filter(e => e.product != pid)));
            return this.#model.updateOne({_id:id},{$set:{cart:filteredCart}});
        }catch(error){
            console.log(error)
        }
        
       
    }

}

export default  CartService;