import MongoClass from "../../contenedores/MongoClass.js";
import { carritosSchema } from "../../modelosMongoose/carritosSchema.js"

export class MongoDBCarritos extends MongoClass{
    constructor(){
        super('carritos', carritosSchema)
    }
}