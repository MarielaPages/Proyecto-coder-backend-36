import MongoClass from "../../contenedores/MongoClass.js";
import { productosSchema } from "../../modelosMongoose/productosSchema.js"

export class MongoDBProductos extends MongoClass{
    constructor(){
        super('productos', productosSchema)
    }
}