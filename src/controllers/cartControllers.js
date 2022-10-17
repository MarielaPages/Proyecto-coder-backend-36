import logger from "../../logger.js"
import { getCartByEmail, deleteCartByEmail, createOpenCart, createFinishedCart } from "../servicios/cartServicios.js"

//fecha para los logs
const d = new Date();
const day = d.getDate()
const month = d.getMonth() + 1
const year = d.getFullYear()
const hour = d.getHours()
const minutes = d.getMinutes()
const second = d.getSeconds()
const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`

export async function getCartToShow(req, res){
    try{
        logger.info(`${date} -Route: /cart/show -Method: GET`)
        res.render('cart')
    } catch(error){
        logger.error(`${date} -Route: /cart/show -Method: GET -Error: ${error}`)
    }
}

export async function getOpenCart(req, res){
    try{
        logger.info(`${date} -Route: /cart -Method: GET`)
        let carritoAbierto = await getCartByEmail(req.user.email)
        
        res.json(carritoAbierto[0])
    } catch(error){
        logger.error(`${date} -Route: /cart -Method: GET -Error: ${error}`)
    }
}

export async function putCart(req, res){
    try{
        logger.info(`${date} -Route: /cart -Method: PUT`)
        
        const { cart } = req.body

        const updatedCart = {userEmail: req.user.email, products: cart}

        await deleteCartByEmail(req.user.email)
        await createOpenCart(updatedCart)

        res.status(201).json({statusCode: 201, message: 'producto agregado con exito al carrito'});
    } catch(error){
        logger.error(`${date} -Route: /cart -Method: PUT -Error: ${error}`)
    }
}

export async function postFinishedCart(req, res){
    try{

        logger.info(`${date} -Route: /cart -Method: POST`)

        await createFinishedCart(req)

        res.status(201).json({statusCode: 201, message: 'Carrito con productos comprados creado con exito'});
    } catch(error){
        logger.error(`${date} -Route: /cart -Method: POST -Error: ${error}`)
    }
}