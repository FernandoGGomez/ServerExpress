import { generateProducts } from "../../utils/mock.js";

class MockingProductController{


    async create(req,res,next){
            const products = Array.from({length:100},()=>generateProducts());

            res.status(200).send({ok:true,payload:products})
    }
}

const controller = new MockingProductController();

export default controller;