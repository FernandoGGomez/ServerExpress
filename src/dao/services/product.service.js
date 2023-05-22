import { productsModel } from "../models/products.model.js"

class ProductService{
    #model;
    constructor(){
        this.#model = productsModel;
    }

    async create(data){
        return this.#model.create(data);
    }

    async findAll(limit,page,sort,category,status){
        return this.#model.paginate(category && status?{category:category,status:status}:category?{category:category}:status?{status:status}:{},{limit:limit,page:page,sort:{price:sort},lean:true});
    }

    async findAllProducts(){
        return this.#model.find()
    }

    async findById(id){
        return this.#model.findById(id);
    }

    async findOne(filter){
        return this.#model.findOne(filter)
    }

    async update(id,data){
        await this.#model.updateOne(id,data)
        const updateData = await this.findById(id);
        return updateData;
    }

    async delete(id){
        return this.#model.findByIdAndDelete(id);
    }

}

export default ProductService;