import mongoose from "mongoose";

export const mensajesSchema = new mongoose.Schema(
    {
        userEmail: {type: String, required:true},
        destination: {type: String, required:true},
        date: {type: Date, required:true},
        message: {type:String, required:true}
    }
)