import mongoose from "mongoose";

const messagesCollection = "messages"

const messagesSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true,
        
    },
    
    message:{
        type: String
    }
})

export const messageModel = mongoose.model(messagesCollection,messagesSchema)