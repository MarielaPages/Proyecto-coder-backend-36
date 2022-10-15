import MongoClass from "../../contenedores/MongoClass.js";
import { mensajesSchema } from "../../modelosMongoose/mensajesSchema.js"

export class MongoDBMensajes extends MongoClass{
    constructor(){
        super('mensajes', mensajesSchema)
    }
}