import { Router } from "express"
import { getCartToShow, getOpenCart, putCart, postFinishedCart } from "../controllers/cartControllers.js"

const router = Router()

//Creo funcion para chequear si el usuario esta autenticado
function isAuth(req, res, next){
    if(req.isAuthenticated()){ //req.isAuthenticated() devuelve true o false. es true si esta la info de la persona en session porque se autentico
        next()
    } else {
        res.render('signIn')
    }
}

//Ruta para ver lo que contiene el carrito
router.get('/show', isAuth, getCartToShow)

//Ruta para traer el carrito abierto
router.get('/', isAuth, getOpenCart)

//Ruta para llenar de productos el carrito
router.put('/', isAuth, putCart)

//Ruta para enviar a compra lo que hay en el carrito
router.post('/', isAuth, postFinishedCart)


export default router 