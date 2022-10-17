import { productosDao } from '../daos/index.js'

//Creo instancia (objeto) de la clase MongoDBProductos que es extension de la MongoClass
const mongoProductos = productosDao();

export async function getAllProducts(){
    return await mongoProductos.getAll()
}

export async function createProducts(products){
    return await mongoProductos.create(products) //si se crear uno devuelve el doc que se creo como objeto y si se craron mas de uno, dvuevle array con los docs creados, si no se crea nada por errores, devuelve undefined (porque maneje el error con un console.log)
}