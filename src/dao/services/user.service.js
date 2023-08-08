import { usersModel } from "../models/user.model.js"

class UserService{
    #model;
    constructor(){
        this.#model = usersModel;
    }

    async create(data){
        return this.#model.create(data);
    }

    async findAll(){
        const users = await this.#model.find();
        return users;
    }

    async findOne(filter){
        const user = await this.#model.findOne(filter);
        return user
    }

    async updateOne(filter,newData){
        
        return  this.#model.updateOne(filter,{$set : newData})
    }

    async delete(id){
        return this.#model.findByIdAndDelete(id);
    }

}

export default  UserService;