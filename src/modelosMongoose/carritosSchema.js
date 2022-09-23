import mongoose from "mongoose";

export const carritosSchema = new mongoose.Schema(
    {
        userID: {type: mongoose.Schema.Types.ObjectId, required: true},  //cada carrito sera aquel con los productos que le pertencen al mismo user
        products: [{
            product: {type: mongoose.Schema.Types.ObjectId, required: true}, 
            amount: {type: Number}
        }] //Entiendo que aca pueden entrar varios objetos con ese formato
    }
)