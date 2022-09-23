import MongoClass from "../../contenedores/MongoClass.js";
import { carritosAbiertosSchema } from "../../modelosMongoose/carritosAbiertosSchema.js"

export class MongoDBCarritosAbiertos extends MongoClass{
    constructor(){
        super('carritosAbiertos', carritosAbiertosSchema)
    }
}