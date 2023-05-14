import mongoose from "mongoose";

const cartsCollection="carts"

const cartsSchema = new mongoose.Schema({
    cart:{
        type: [
                {
                    product:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:"products"
                    },
                    quantity:{
                        type: Number,
                        default:0
                    }
                }
            ],
        default: []
    }
})

export const cartsModel = mongoose.model(cartsCollection,cartsSchema)