import mongoose from 'mongoose'
import dotenv from 'dotenv'

//inicializo el metodo config para que dotenv pueda leer el .env y trabajar con el
dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.MONGO_BD_PASSWORD}@cluster0.ashm8.mongodb.net/${process.env.MONGO_BD_NAME}?retryWrites=true&w=majority`)
.then(res => console.log('mongoose conectado a la base de datos'))
.catch(err => console.log(err))

//console.log(process.env)