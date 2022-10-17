import logger from "../../logger.js"
import { getAllProducts, createProducts } from "../servicios/productServicios.js";

//fecha para los logs
const d = new Date();
const day = d.getDate()
const month = d.getMonth() + 1
const year = d.getFullYear()
const hour = d.getHours()
const minutes = d.getMinutes()
const second = d.getSeconds()
const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`

export async function getProductsToShow(req, res){
    try{
        logger.info(`${date} -Route: /products/show -Method: GET`)
        const allProducts = await getAllProducts()
        res.render('products', {arrayProds: allProducts})
    } catch(error){
        logger.error(`${date} -Route: /products/show -Method: POST -Error: ${error}`)
    }
}

export async function postProducts(req, res){
    try{
        logger.info(`${date} -Route: /products -Method: POST`)
        const products = req.body
        const allProducts = await createProducts(products)
        allProducts? res.status(201).json({statusCode: 201, message: 'Producto creado con éxito'}) : res.status(400).json({message: 'productos validation failed'});
    } catch(error){
        logger.error(`${date} -Route: /products -Method: POST -Error: ${error}`)
    }
}