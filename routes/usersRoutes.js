import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router() //Nos permite crear varias rutas con diversos tipos de peticiones HTTP y luego exportarlos gracias a express

//Ruta de registro para registrar usuarios. api/users/signup
router.post('/signup', async (req, res) => { //Vamos a enviar datos a traves de un formulario, asi que es post. Registro de usuarios
    //Comprobar si el usuario ya esta registrado o no. Si esta registrado lanzaremos un status
    let user = await User.findOne({email: req.body.email})
    if (user) return res.status(400).send('User alredy registered')

    //Creamos el usuario
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    })

    //Lo almacenamos en la base de datos
    try{
        await user.save()

        //Creamos el token al usuario
        const token = jwt.sign({
            _id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '1h' //Tiempo en el q es valido el token
        })

        //Devolvemos al cliente el usuario que ha creado y su token
        res.status(201).header('Authorization', token).json({ 
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        })

    //Manejamos errores
    } catch(error){
        res.status(500).send('Something went wrong')
    }
}) 

//Ruta de login para que logeen usuarios que ya estan registrados. api/users/login
router.post('/login', async (req, res) => { //Login igual
    const user= await User.findOne({email: req.body.email}) //Comprobamos si el usuario existe
    if (!user) return res.status(400).send('Invalid email or password') //Si no existe el usuario lanzamos el status

    const validPassword = await bcrypt.compare(req.body.password, user.password) //Verificamos si la contraseña que ha puesto el usuario en la peticion es la misma que la que esta registrada. Debemos usar bcrypt ya que esta encriptada la contraseña
    if (!validPassword) return res.status(400).send('Invalid email or password')

    //Creamos el token si todo esta correcto
    const token = jwt.sign({
        _id: user.id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: '1h' //Tiempo en el q es valido el token
    })

    //Enviamos la respuesta. Devuelve el token
    res.status(200).header('Authorization', token).json({token : token})
}) 

export default router