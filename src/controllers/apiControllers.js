import logger from "../../logger.js"

//fecha para los logs
const d = new Date();
const day = d.getDate()
const month = d.getMonth() + 1
const year = d.getFullYear()
const hour = d.getHours()
const minutes = d.getMinutes()
const second = d.getSeconds()
const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`

export function getSignIn(req, res){
    logger.info(`${date} -Route: / -Method: GET`)
    res.render('signIn')
}

export function getSignUp(req, res){
    logger.info(`${date} -Route: /signUp -Method: GET`)
    res.render('signUp')
}

export function getErrorRegistro(req, res){
    logger.info(`${date} -Route: /errorRegistro -Method: GET`)
    res.render('errorRegistro')
}

export function getLogIn(req, res) {
    logger.info(`${date} -Route: /login -Method: GET`)
    res.render('signIn')
}

export function getErrorLogIn(req, res){
    logger.info(`${date} -Route: /errorLogin -Method: GET`)
    res.render('errorLogin')
}

export function getBienvenido(req, res) {
    logger.info(`${date} -Route: /bienvenido -Method: GET`)
    res.render('bienvenido', {name: req.user.name})
}

export function getLogOut(req, res){
    req.session.destroy(err => {
        if(err){
            return res.json({status: 'logout ERROR'})
        }
        })
    logger.info(`${date} -Route: /logout -Method: GET`)
    res.render('adios')
}

export function getInfo(req, res){
    logger.info(`${date} -Route: /info -Method: GET`)
    res.render('info', {
        argumentosEntrada: process.argv[3],
        nombrePlataformaSO: process.platform,
        versionNode: process.version,
        memoriaRservada: process.memoryUsage.rss(),
        execPath: process.execPath,
        processId: process.pid,
        projectFile: process.cwd(),
        numeroProcesadores: numCPUs
    })
}