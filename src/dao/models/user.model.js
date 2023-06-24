import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const usersCollection="users"

const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    last_name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        unique:true,
        required: true
    },

    age:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    rol:{
        type: String,
        default: "Usuario"
    },
    cart:{
        type:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"carts",
        }
    }
    
})

usersSchema.plugin(mongoosePaginate);

export const usersModel = mongoose.model(usersCollection,usersSchema)