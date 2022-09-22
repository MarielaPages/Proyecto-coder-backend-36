import { Router } from "express"
import { carritosDao } from "../daos/index.js"
import logger from "../../logger.js"

const router = Router()

//Creo instancia (objeto) de la clase MongoDBCarritos que es extension de la MongoClass
const mongoProductos = carritosDao();

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
const second = d.getMilliseconds()
const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`

router.get('/show', isAuth, async (req, res) => {
    try{
        res.render('cart')
    } catch(error){
        throw error
    }
})

router.post('/', isAuth, async (req, res) => {
    try{
        const { cart } = req.body
        console.log(cart)

        //Ingreso los datos de productos que necesitamos en la base de datos (objetos con el id del producto y su cantidad)
        let products = []

        cart.forEach(element => {
            products.push({product: element.product, amount:element.amount})
        });

        //creo el objeto que tendra el id del usuario y los productos que compro. Esto sera lo que finalmente va a la base de datos
        let cartMongo = {userID: req.user["_id"], products}
        await mongoProductos.create(cartMongo)

        res.status(201).json({statusCode: 201, message: 'Carrito con productos comprados creado con exito'});
    } catch(error){
        res.status(400).json({message: `${error}`});
    }
})

export default router 