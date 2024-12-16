import winston from "winston";

const logger = winston.createLogger({
    level: "error", //Nivel de loggin que queremos inplementar, tipo info, errores...
    format: winston.format.combine(
        winston.format.timestamp(), //Que registre el tiempo cuando se produce un error
        winston.format.prettyPrint() //Para que lo muestre de manera mas legible en la terminal
    ),
    transports: [
        new winston.transports.File({
            filename: "error.log", level: "error"
        }),
        new winston.transports.File({
            filename: "info.log", level: "info"
        })
    ] // Para indicar como queremos que se guarde. En este caso en forma de archivo que nos muestre todos los errores y otro con toda la info
})

export default logger