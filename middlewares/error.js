import logger from "../helpers/logger.js";

export default function error(err, req, res, next){ //Ponemos un parametro de error. No hay next porque como habra un error se para la ejecucion
    logger.error(err.message, {metadata: err}) //El objeto de winston
    res.status(500).send("Something failed")
}