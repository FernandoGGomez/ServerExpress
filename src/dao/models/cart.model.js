import mongoose from "mongoose";

const cartsCollection="carts"

const cartsSchema = new mongoose.Schema({
    cart:{
        type: Array,
        default: []
    }
})

export const cartsModel = mongoose.model(cartsCollection,cartsSchema)