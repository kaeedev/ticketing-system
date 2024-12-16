import jwt from 'jsonwebtoken'

export default function auth(req, res, next){
    const token= req.header('Authorization').replace("Bearer ", "") //Token tendrá esta cabecera
    if (!token) return res.status(401).send('Access denied. No token provided') //Si no existe un token, el usuario no tiene acceso
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET) //Esto nos devolvera el token codificado y verificado añadiendole la variable de entorno
        req.user = verified //Modificamos el usuario con todo verificado
        next() //Completamos el proceso de capas de la peticion
    } catch(error) {
        res.status(400).send('Invalid token') //Si ocurre algun error
    }
}

