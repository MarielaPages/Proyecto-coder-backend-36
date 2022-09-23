import { Router } from "express"
import { carritosDao } from "../daos/index.js"
import { carritosAbiertosDao } from "../daos/index.js"
import logger from "../../logger.js"

const router = Router()

//Creo instancia (objeto) de la clase MongoDBCarritos que es extension de la MongoClass
const mongoCarritos = carritosDao();

//Creo instancia (objeto) de la clase MongoDBCarritosAbiertos que es extension de la MongoClass
const mongoCarritosAbiertos = carritosAbiertosDao();

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

//Ruta para ver lo que contiene el carrito
router.get('/show', isAuth, async (req, res) => {
    try{
        res.render('cart')
    } catch(error){
        throw error
    }
})

//Ruta para traer el carrito abierto
router.get('/', isAuth, async (req, res) => {
    try{
        let carritoAbierto = await mongoCarritosAbiertos.getByEmail(req.user.email)

        res.json(carritoAbierto[0])
    } catch(error){
        throw error
    }
})

//Ruta para enviar a compra lo que hay en el carrito
router.post('/', isAuth, async (req, res) => {
    try{
        const { cart } = req.body

        //Ingreso los datos de productos que necesitamos en la base de datos (objetos con el id del producto y su cantidad)
        let products = []

        cart.forEach(element => {
            products.push({product: element.product, amount:element.amount})
        });

        //creo el objeto que tendra el id del usuario y los productos que compro. Esto sera lo que finalmente va a la base de datos
        let cartMongo = {userID: req.user["_id"], products: products}
        await mongoCarritos.create(cartMongo)

        res.status(201).json({statusCode: 201, message: 'Carrito con productos comprados creado con exito'});
    } catch(error){
        res.status(400).json({message: `${error}`});
    }
})

//Ruta para llenar de productos el carrito
router.put('/', isAuth, async (req, res) => {
    try{
        const { cart } = req.body

        const updatedCart = {userEmail: req.user.email, products: cart}

        await mongoCarritosAbiertos.deleteByEmail(req.user.email)
        await mongoCarritosAbiertos.create(updatedCart)

        res.status(201).json({statusCode: 201, message: 'Carrito con productos comprados creado con exito'});
    } catch(error){
        res.status(400).json({message: `${error}`});
    }
})

export default router 