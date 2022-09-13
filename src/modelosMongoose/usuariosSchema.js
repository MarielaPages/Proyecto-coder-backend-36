import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const usuarioSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    age: {type: Number, required: true},
    phone: {type: Number, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    thumbnail: {type: String, required: true}
})

// Creo metodo del esquema
usuarioSchema.methods.encriptar = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(5))   //genera la contrasena encriptada a partir de la que se le pasa
}

export default mongoose.model('usuarios', usuarioSchema)