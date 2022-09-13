import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import './src/passport/local.js'
import './src/mongooseConnection/mongooseConnection.js'
import apiRoutes from './src/routes/apiRoutes.js'
import dotenv from 'dotenv'
import morgan from "morgan" //Para ver los codigos de estado cuando monitorizamos
import path from 'path';
import { fileURLToPath } from 'url'; //--> el de arriba y este son por si quisiera usar __dirname
//para usar el __dirname hay que hacer un par de configs (ver https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/)
import cluster from 'cluster' //lib nativa de node
import os from 'os' //lib nativa de node
import yargs from "yargs/yargs"
import multer from 'multer'

//Configuro para poder utilizar el __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//creo mi app servidor
const app = express();

//console.log(yargs(process.argv)) esto devuelve objeto que tiene a argv como una prop con su valor (un objeto con los args)
const args = yargs(process.argv.slice(2)).argv //variable que contiene el objeto argv que estaba en el objeto antes mencionado

//Posibilito el modo cluster. Si se pasa CLUSTER como argumento, se armara un cluster de servidores (varias instancias del mismo servidor)
const MODO_CLUSTER = args.MODO

if(MODO_CLUSTER === 'CLUSTER' && cluster.isPrimary){
    const numCPUs = os.cpus().length //num de cspus de mi compu
    for (let i=0; i<numCPUs; i++){
        cluster.fork() //crea un servidor fork para cada cpu (una instancia del servidor por cada cpu)
    }
    //Utilizo metodo on de cluster por si muere/cae una de las instancias del servidor. Si sucede, se creara otra automaticamente. 
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork()
    })
} else{
    //inicializo el metodo config para que dotenv pueda leer el .env y trabajar con el
    dotenv.config();

    //le digo a la app donde estaran mis templates y prendo el motor de plantillas
    app.set('views', './src/views')
    app.set('view engine', 'ejs')

    //Seteo donde se guardaran los files que me lleguen de formularios y con que nombres (para multer)
    const storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, __dirname+"/src/public/files")
    },
    filename: function(req, file, cb){
      cb(null, file.originalname)
    }
  })

    //middlewares
    app.use(morgan("dev"))
    app.use(multer({storage}).single("thumbnail"))
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(express.static(__dirname+"/src/public"));
    app.use(session({
        secret:'secretKey',
        saveUninitialized: false,
        resave:false,
        store: MongoStore.create({mongoUrl: `mongodb+srv://${process.env.MONGO_BD_PASSWORD}@cluster0.ashm8.mongodb.net/${process.env.MONGO_SESSION_BD_NAME}?retryWrites=true&w=majority`}),
        cookie: {maxAge:600000} //sesion expira en 10 mins (a menos que refresque la pagina del sitio, que seria la de bienvenido)
    }))
    app.use(passport.initialize()) //creo que este es para que funcione passport
    app.use(passport.session())//para que session funcione con passport
    app.use('/', apiRoutes)



    //inicio server
    const PORT = parseInt(args.PORT) || 8080
    const server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`)
    })

    server.on('error', error => console.log(`Error en el servidor ${error}`))
    }

