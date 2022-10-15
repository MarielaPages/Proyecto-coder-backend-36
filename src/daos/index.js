import { MongoDBProductos } from "./productos/MongoDBProductos.js";
import { MongoDBCarritos } from './carritos/MongoDBCarritos.js';
import { MongoDBCarritosAbiertos } from "./carritosAbiertos/MongoDBCarritosAbiertos.js";
import { MongoDBMensajes } from "./mensajes/MongoDBmensajes.js";
import dotenv from 'dotenv'

dotenv.config(); //inicializo la funcion config para poder leer el .env

//Estos daos son la capa de persistencia que permiten el acceso a las distintas colecciones de la base de datos y hacer acciones sobre ellas a partir de los metodos que armamos en la MongoClass

export let productosDao = function(){
    switch(process.env.DB_MONGO_NAME){
        case 'mongoDB':
            return new MongoDBProductos();
        default:
            console.log('Esta base de datos no existe para este proyecto')
            break;
    }
}

export let carritosDao = function(){
    switch(process.env.DB_MONGO_NAME){
        case 'mongoDB':
            return new MongoDBCarritos();
        default:
            console.log('Esta base de datos no existe para este proyecto')
            break;
    }
}

export let carritosAbiertosDao = function(){
    switch(process.env.DB_MONGO_NAME){
        case 'mongoDB':
            return new MongoDBCarritosAbiertos();
        default:
            console.log('Esta base de datos no existe para este proyecto')
            break;
    }
}

export let mensajesDao = function(){
    switch(process.env.DB_MONGO_NAME){
        case 'mongoDB':
            return new MongoDBMensajes();
        default:
            console.log('Esta base de datos no existe para este proyecto')
            break;
    }
}


