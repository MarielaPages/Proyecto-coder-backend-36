import passport from "passport";
import { Strategy } from 'passport-local';
import Usuarios from '../modelosMongoose/usuariosSchema.js'
import bcrypt from 'bcrypt'
import { carritosAbiertosDao } from "../daos/index.js";
import nodemailer from 'nodemailer'

const LocalStrategy = Strategy; //guardo el metodo en esa cte

//creo funcion comprar para la contra encriptada
const comparar = (password, userEncryptPass) => {
    return bcrypt.compareSync(password, userEncryptPass) //devuelve true si son iguales y false sino
}

//Creo instancia (objeto) de la clase MongoDBCarritosAbiertos que es extension de la MongoClass
const mongoCarritosAbiertos = carritosAbiertosDao();

//Creo mis funciones passport
passport.use('registro', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const { name, address, age, phone } = req.body
    const imagen = req.file;
    const usuarioBD = await Usuarios.findOne({email: email})
    if(usuarioBD){
        return done(null, false); // si ya existe devlve null porque no hubo error, pero false indicando que la rsta no fue satisfactoria. false indica falla en el registro
        //pongo return para que frene la ejec de la funcion si ya existia
    }
    const usuarioNuevo = new Usuarios(); //creo nueva instancia del modelo (o sea, un documento) que tendra los metodos que tiene el modelo
    usuarioNuevo.name = name;
    usuarioNuevo.address = address;
    usuarioNuevo.age = age;
    usuarioNuevo.phone = phone;
    usuarioNuevo.email = email;
    usuarioNuevo.password = usuarioNuevo.encriptar(password);
    usuarioNuevo.thumbnail = '/files/'+imagen.filename; //llegara con filename como el nombre original con el que lo subo ya que asi lo setie en el server
    await usuarioNuevo.save(); //con esto se inserta el documento en la coleccion usarios que asigne en el archivo del esquema para usuarios
    
    let openCartMongo = {userEmail: email, products:[]}

    await mongoCarritosAbiertos.create(openCartMongo)

    //Armo mail al administrador con la info de los nuevos registros
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
            <h2>Nuevo usuario registrado:</h2>
            <h3>Nombre: ${name}</h3>
            <h3>Mail: ${email}</h3>
            <h3>Dirección: ${address}</h3>
            <h3>Edad: ${age}</h3>
            <h3>Número de teléfono: ${phone}</h3>`
    })
    
    return done(null, usuarioNuevo);
}
))

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const usuarioBD = await Usuarios.findOne({email: email})
    if(!usuarioBD){
        return done(null, false)
    }
    if(!comparar(password, usuarioBD.password)){
        return done(null, false)
    }
    return done(null, usuarioBD) //ese usuarioBD es lo que passport guarda en req.user al hacer el login
}
))

//creo la serializ y deserializ --> por esto en session se guarda en passport solo user y el id, no se pasa toda la info del usuario que se logueo
passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
})
passport.deserializeUser(async(id, done) => {
    const usuario = await Usuarios.findById(id);
    done(null, usuario)
})


