import { Router } from "express"
import { getProductsToShow, postProducts } from "../controllers/productControllers.js"

const router = Router()

//Creo funcion para chequear si el usuario esta autenticado
function isAuth(req, res, next){
    if(req.isAuthenticated()){ //req.isAuthenticated() devuelve true o false. es true si esta la info de la persona en session porque se autentico
        next()
    } else {
        res.render('signIn')
    }
}

router.get('/show', isAuth, getProductsToShow)

router.post('/', postProducts)



export default router 