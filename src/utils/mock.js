import {Faker,es,en,base} from "@faker-js/faker";

const faker = new Faker({
    locale : [es,en,base]
})

export function generateProducts(){
    return {
        _id:faker.database.mongodbObjectId(),
        title:faker.commerce.productName(),
        desription:faker.commerce.productDescription(),
        price:faker.commerce.price(),
        thumbnail:faker.image.url(),
        code:faker.string.alphanumeric({ length: { min: 5, max: 14 } }),
        status: faker.datatype.boolean(),
        stock:faker.number.int({min:1,max:2500}),
        category: faker.commerce.department()

    }
}