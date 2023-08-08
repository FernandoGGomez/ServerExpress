export default class UserDto{
    constructor({name,last_name,email,rol,age,cart}){
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.age = age;
        this.rol = rol;
        this.cart = cart;
    }
}

export class UsersDto{
    constructor({name,last_name,email,rol}){
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.rol = rol;
    }
}