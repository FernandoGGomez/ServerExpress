import * as path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title: "Eccomerce API",
            version: "1.0.0",
            descripcion: "This is a Ecommerce API",
        },
    },
    apis: [path.resolve("./src/docs/**/*.yaml")],
};

const spec = swaggerJSDoc(swaggerOptions);
export default spec;