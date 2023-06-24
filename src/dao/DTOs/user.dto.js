export default class UserDto{
    constructor({name,last_name,email,rol,age,cart}){
        console.log(cart)
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.age = age;
        this.rol = rol;
        this.cart = cart;
    }
}