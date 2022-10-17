import { carritosDao } from "../daos/index.js"
import { carritosAbiertosDao } from "../daos/index.js"
import nodemailer from 'nodemailer'

//Creo instancia (objeto) de la clase MongoDBCarritos que es extension de la MongoClass
const mongoCarritos = carritosDao();

//Creo instancia (objeto) de la clase MongoDBCarritosAbiertos que es extension de la MongoClass
const mongoCarritosAbiertos = carritosAbiertosDao();

export async function getCartByEmail(userEmail){
    return await mongoCarritosAbiertos.getByEmail(userEmail)
}

export async function deleteCartByEmail(userEmail){
    await mongoCarritosAbiertos.deleteByEmail(userEmail)
}

export async function createOpenCart(cart){
    await mongoCarritosAbiertos.create(cart)
}

export async function createFinishedCart(request){

    const { cart } = request.body

    //Ingreso los datos de productos que necesitamos en la base de datos (objetos con el id del producto y su cantidad)
    let products = []

    cart.forEach(element => {
        products.push({product: element.product, amount:element.amount})
    });

    //creo el objeto que tendra el id del usuario y los productos que compro. Esto sera lo que finalmente va a la base de datos
    let cartMongo = {userID: request.user["_id"], products: products}
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
            <h3>Nombre: ${request.user.name}</h3>
            <h3>Mail: ${request.user.email}</h3>
            <h3>Dirección: ${request.user.address}</h3>
            <h3>ID: ${request.user["_id"]}</h3>
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
}


