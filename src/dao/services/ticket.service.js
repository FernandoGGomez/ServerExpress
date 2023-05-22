import mongoose from "mongoose";
import { ticketsModel } from "../models/ticket.model.js"
class TicketService{
    #model;
    constructor(){
        this.#model = ticketsModel;
    }

    async create(data){
        return this.#model.create(data);
    }

    async findById(id){
        return  this.#model.findById(id);
       
    }


    async delete(id){
        return this.#model.findByIdAndDelete(id);
    }
 

}

export default  TicketService;