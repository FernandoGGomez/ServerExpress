export default class ProductDto{
    constructor({title,description,price,thumbnail,code,status,stock,category}){
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.status = status;
        this.stock = stock;
        this.category = category;
    }
}