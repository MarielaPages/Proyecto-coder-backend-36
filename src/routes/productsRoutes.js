import { Router } from "express"
import logger from "../../logger.js"
import { productosDao } from '../daos/index.js'

const router = Router()

//Creo instancia (objeto) de la clase MongoDBProductos que es extension de la MongoClass
const mongoProductos = productosDao();

//Creo funcion para chequear si el usuario esta autenticado
function isAuth(req, res, next){
    if(req.isAuthenticated()){ //req.isAuthenticated() devuelve true o false. es true si esta la info de la persona en session porque se autentico
        next()
    } else {
        res.render('signIn')
    }
}

//fecha para los logs
const d = new Date();
const day = d.getDate()
const month = d.getMonth() + 1
const year = d.getFullYear()
const hour = d.getHours()
const minutes = d.getMinutes()
const second = d.getSeconds()
const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`

router.get('/show', isAuth, async (req, res) => {
    try{
        logger.info(`${date} -Route: /products/show -Method: GET`)
        const allProducts = await mongoProductos.getAll()
        res.render('products', {arrayProds: allProducts})
    } catch(error){
        logger.error(`${date} -Route: /products/show -Method: POST -Error: ${error}`)
    }
})

router.post('/', async (req, res) => {
    try{
        logger.info(`${date} -Route: /products -Method: POST`)
        const products = req.body
        const allProducts = await mongoProductos.create(products)
        allProducts? res.status(201).json({statusCode: 201, message: 'Producto creado con éxito'}) : res.status(400).json({message: 'productos validation failed'});
    } catch(error){
        logger.error(`${date} -Route: /products -Method: POST -Error: ${error}`)
    }
})



export default router 