import mongoose from 'mongoose'

class MongoClass { 
    constructor(collectionName, docSchema){
        this.collectionModel = mongoose.model(collectionName, docSchema)
    }
    async create(obj){
        try {
            const newDoc = await this.collectionModel.create(obj); //si solo pase un obj para crear, devuelve el doc que se creo (como objeto, no array con objeto), si se pasaron mas de un obj, devuelve array con los docs creados
            return newDoc;
        } catch (error) {
            console.log("create error",error);
        }
    }
    async getAll(){
        try {
            const allDocs = await this.collectionModel.find({}); // devuelve array de objetos JS (si es uno solo, igual es un array con un objeto. Si no hay docs, devuelve array vacio)
            return allDocs;
        } catch (error) {
            console.log("getAll error",error);
        }
    }
    async getById(id){
        try {
            const Doc = await this.collectionModel.find({_id:id}); //devuelve array con el objeto encontrado en formato js
            return Doc;
        } catch (error) {
            console.log("getById error",error);
        }
    }
    async getByEmail(email){ //solo para carritos abiertos que tienen userEmail como key
        try {
            const Doc = await this.collectionModel.find({userEmail:email}); //devuelve array con el objeto encontrado en formato js
            return Doc;
        } catch (error) {
            console.log("getByEmail error",error);
        }
    }
    async getByEmail2(cusrtomerEmail){ //Solo para mensajeria
        try {
            const Doc = await this.collectionModel.find({$or: [{userEmail : cusrtomerEmail}, {destination : cusrtomerEmail}]}); //devuelve array con el objeto encontrado en formato js
            return Doc;
        } catch (error) {
            console.log("getByEmail error",error);
        }
    }
    async deleteAll(){
        try {
            const docsBorrados = await this.collectionModel.deleteMany({})
            return docsBorrados
        } catch (error) {
            console.log("deleteAll error",error);
        }
    }
    async deleteById(id){
        try {
            const docBorrado = await this.collectionModel.deleteOne({_id:id})
            return docBorrado
        } catch (error) {
            console.log("deleteById error",error);
        }
    }
    async deleteByEmail(email){ //solo para carritos abiertos que tienen userEmail como key
        try {
            const docBorrado = await this.collectionModel.deleteOne({userEmail:email})
            return docBorrado
        } catch (error) {
            console.log("deleteByEmail error",error);
        }
    }
    async updateStockById(id, stock){
        try {
            const docUpdatado = await this.collectionModel.updateOne({_id:id}, {$set:{stock:stock}})
            return docUpdatado
        } catch (error) {
            console.log("updateById error",error);
        }
    }
}

export default MongoClass