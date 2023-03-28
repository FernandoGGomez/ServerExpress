import { messageModel } from '../dao/models/messages.model.js';
import { MongoManager } from './mongoManager.js';
class ChatManager{

    #persistencia
    constructor(persistencia){

        this.#persistencia = persistencia

    }


    async getAll(){

        try{
            
          return  await this.#persistencia.getAll()
            

        }
        catch(error){
            throw error
        }

    }

    async create(userMessage){
        try{

            
                const message = this.#persistencia.create(userMessage)
                 return message
            
            
            

        }catch(error){

            console.log("El error: ",error) 
        }
        

        }


        async updateOne(userId,message){
            this.#persistencia.updateOne(userId,message)
        }

}


const instancia = new ChatManager(new MongoManager(messageModel));
export default instancia;