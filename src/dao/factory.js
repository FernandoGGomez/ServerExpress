import { config } from "../../utils/configure.js";
import mongoose from "mongoose";
class Factory{
    static getDao(){
        switch(config.persistence){
            case "MONGO":
                mongoose.connect(config.mongo_url,{useNewUrlParser: true,useUnifiedTopology:true});
                // const {default:}
                break;
            default:
                throw new Error("Wrong config")
        }

    }

}