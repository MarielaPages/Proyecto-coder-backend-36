import { Router } from "express"
import logger from "../../logger.js"

const router = Router()

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

export default router 