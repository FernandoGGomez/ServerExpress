import { usersModel } from "../models/user.model.js"

class UserService{
    #model;
    constructor(){
        this.#model = usersModel;
    }

    async create(data){
        return this.#model.create(data);
    }

    async findOne(email){
        const user = await this.#model.findOne({email:email});
        return user
    }

    async updateOne(email,password){

        return  this.#model.updateOne({email},{$set :{password:password}})
    }

    async delete(id){
        return this.#model.findByIdAndDelete(id);
    }

}

export default  UserService;