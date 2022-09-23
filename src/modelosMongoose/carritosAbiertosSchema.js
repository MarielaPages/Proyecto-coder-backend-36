import mongoose from "mongoose";

export const carritosAbiertosSchema = new mongoose.Schema(
    {
        userEmail: {type: String, required: true},  //cada carrito sera aquel con los productos que le pertencen al mismo user
        products: [{
            product: {type: mongoose.Schema.Types.ObjectId}, 
            amount: {type: Number},
            price: {type: Number},
            title: {type: String},
            thumbnail: {type: String}
        }] //Entiendo que aca pueden entrar varios objetos con ese formato
    }
)