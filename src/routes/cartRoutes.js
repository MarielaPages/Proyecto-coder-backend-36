import { Router } from "express"
import { carritosDao } from "../daos/index.js"
import { carritosAbiertosDao } from "../daos/index.js"
import logger from "../../logger.js"
import nodemailer from 'nodemailer'

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
const second = d.getSeconds()
const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`

//Ruta para ver lo que contiene el carrito
router.get('/show', isAuth, async (req, res) => {
    try{
        logger.info(`${date} -Route: /cart/show -Method: GET`)
        res.render('cart')
    } catch(error){
        logger.error(`${date} -Route: /cart/show -Method: GET -Error: ${error}`)
    }
})

//Ruta para traer el carrito abierto
router.get('/', isAuth, async (req, res) => {
    try{
        logger.info(`${date} -Route: /cart -Method: GET`)
        let carritoAbierto = await mongoCarritosAbiertos.getByEmail(req.user.email)
        
        res.json(carritoAbierto[0])
    } catch(error){
        logger.error(`${date} -Route: /cart -Method: GET -Error: ${error}`)
    }
})

//Ruta para llenar de productos el carrito
router.put('/', isAuth, async (req, res) => {
    try{
        logger.info(`${date} -Route: /cart -Method: PUT`)
        
        const { cart } = req.body

        const updatedCart = {userEmail: req.user.email, products: cart}

        await mongoCarritosAbiertos.deleteByEmail(req.user.email)
        await mongoCarritosAbiertos.create(updatedCart)

        res.status(201).json({statusCode: 201, message: 'producto agregado con exito al carrito'});
    } catch(error){
        logger.error(`${date} -Route: /cart -Method: PUT -Error: ${error}`)
    }
})

//Ruta para enviar a compra lo que hay en el carrito
router.post('/', isAuth, async (req, res) => {
    try{

        logger.info(`${date} -Route: /cart -Method: POST`)

        const { cart } = req.body

        //Ingreso los datos de productos que necesitamos en la base de datos (objetos con el id del producto y su cantidad)
        let products = []

        cart.forEach(element => {
            products.push({product: element.product, amount:element.amount})
        });

        //creo el objeto que tendra el id del usuario y los productos que compro. Esto sera lo que finalmente va a la base de datos
        let cartMongo = {userID: req.user["_id"], products: products}
        await mongoCarritos.create(cartMongo)

        //PODRIA VER DE HACER UN UPDATE DEL STOCK AL HACER ESTO EN LA COLECCION DE PRODUCTOS 

        //Mando la info al administrador con el nombre, mail del usario que compro y los productos que compro
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: 'mai.pages5@gmail.com',
                pass: 'dkmdymgljgoctwrf'
            }
        })
    
        await transporter.sendMail({
            from: 'Proyecto backend <mai.pages@gmail.com>',
            to: 'mai.pages@gmail.com',
            subject: 'Nuevo registro',
            html: `
                <h2>Usuario que compra:</h2>
                <h3>Nombre: ${req.user.name}</h3>
                <h3>Mail: ${req.user.email}</h3>
                <h3>Dirección: ${req.user.address}</h3>
                <h3>ID: ${req.user["_id"]}</h3>
                <h3>Productos comprados:</h3>
                ${cart.map((elem, index) => {
                    return(
                        `<h3>Producto ${index + 1}:</h3>
                        <h4>Id producto: ${elem.product}</h3>
                        <h4>Nombre del producto: ${elem.title}</h3>
                        <h4>Cantidad: ${elem.amount}</h3>`
                    )
                }).join('')}`
        })

        res.status(201).json({statusCode: 201, message: 'Carrito con productos comprados creado con exito'});
    } catch(error){
        logger.error(`${date} -Route: /cart -Method: POST -Error: ${error}`)
    }
})


export default router 