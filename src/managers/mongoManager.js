export class MongoManager{
    
    constructor(model){
        this.model = model
    }


    async getAll(){
        try{
            const entitys = await this.model.find()
            return entitys.map(e => e.toObject())

        }catch(error){
            console.log(error)
            throw error
        }
    }

    async findById(id){
        try{
            const entity = await this.model.findById(id)
            return entity

        }catch(error){
            console.log("hubo un error")
            throw error
            
        }
    }

    async create(entity){
        try{
            const newEntity = await this.model.create(entity)
            return newEntity

        }catch(error){
            console.log("la entidad que le paso : ",entity )
            console.log("el error",error)
            throw error

        }
    }
    async findByIdAndUpdate(id,field,value){
        try{
            const entity = await this.model.findByIdAndUpdate(id,{[field]: value})
            return entity

        }catch(error){
            console.log(error)
            throw error

        }
    }

    async updateOne(id,data){

        try{

            console.log("Data: " ,data)
            const entity = await this.model.updateOne({_id:id},data)

        }catch(error){
            console.log("el ERROR: ",error)
            throw error
            

        }

    }

    async deleteOne(id){
        if(id){
            try{
            
                const deleted = await this.model.deleteOne({_id:id})

                console.log("la newEntity",deleted.deletedCount)
                if(deleted.deletedCount > 0){
                    return true
                }

                return false
                   
            

            }catch(error){
            

                return false

            } 
        }else{
            return false
        }
    }
}