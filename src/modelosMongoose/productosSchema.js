import mongoose from "mongoose";

export const productosSchema = new mongoose.Schema(
    {
        title: {type: String, required:true},
        description: {type: String, required:true},
        price: {type: Number, required:true},
        stock: {type:Number, default:0},
        thumbnail: {type:String, required:true}
    }
)