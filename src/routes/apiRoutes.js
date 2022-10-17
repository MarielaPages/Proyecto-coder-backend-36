import { Router } from "express"
import passport from "passport"
import { fork } from 'child_process'
import os from "os" //libreria nativa de node
import compression from "compression"
import logger from "../../logger.js"
import { getSignIn, getSignUp, getErrorRegistro, getLogIn, getErrorLogIn, getBienvenido, getLogOut, getInfo } from "../controllers/apiControllers.js"

const router = Router()

const numCPUs = os.cpus().length //obtengo el numero de cpus en mi compu

//fecha para los logs
const d = new Date();
const day = d.getDate()
const month = d.getMonth() + 1
const year = d.getFullYear()
const hour = d.getHours()
const minutes = d.getMinutes()
const second = d.getSeconds()
const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`

//Creo funcion para chequear si el usuario esta autenticado
function isAuth(req, res, next){
    if(req.isAuthenticated()){ //req.isAuthenticated() devuelve true o false. es true si esta la info de la persona en session porque se autentico
        next()
    } else {
        res.render('signIn')
    }
}

router.get('/', getSignIn)

router.get('/signUp', getSignUp)

router.post('/signUp', passport.authenticate('registro', { //al hacer esto (el passport.authenticate) ya guarda en session los datos (si se dio success)
    failureRedirect: '/errorRegistro',
    successRedirect: '/login'
})) //No se como poner el logger.info en estos

router.get('/errorRegistro', getErrorRegistro)

router.get('/login', getLogIn)

router.post('/login', passport.authenticate('login', { //al hacer esto se guardan los datos en session (si salio success)
    failureRedirect: '/errorLogin',
    successRedirect: '/bienvenido'
}))

router.get('/errorLogin', getErrorLogIn)

router.get('/bienvenido', isAuth, getBienvenido)

router.get('/logout', getLogOut)

router.get('/info', compression(), getInfo)

router.get('/api/randoms', (req, res)=>{
    logger.info(`${date} -Route: /api/randoms -Method: GET`)
    const { cant } = req.query
    if(!cant){
        logger.error(`${date} -Route: /api/randoms -Method: GET -Error: cantidad no especificada`)
        res.status(400).send("You must send a number using cant parameter")
    }
    //const cantNumeros = cant || 100000000 //si el 1ro no existe, toma el 2do
    const forky = fork('./src/funRandom/funRandom.js') //la ruta se pone como si la buscara desde sever porque desde ahi abre esta ruta con el .use
    //forky.send(cantNumeros) //le envio la catidad como mensaje a la ruta que le puse a fork
    forky.send(cant)
    forky.on('message', nrosRandom => { //recibo la rsta enviada desde la ruta que le puse a fork
        res.send(nrosRandom)
    })

}) //No supe como hacer el controller de este

export default router 