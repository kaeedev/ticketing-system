import "dotenv/config"
import express from 'express'
import morgan from "morgan"
import mongoose from "mongoose"

//DEFINIMOS LA APP
const app = express()

//BASE DE DATOS
const DB_URL = process.env.NODE_ENV === 'test' ? "mongodb://localhost:27017/ticketing-db-test" : process.env.DB_URL || "mongodb://localhost:27017/ticketing-db"
mongoose.connect(DB_URL)
.then(() => console.log(`Connected to DB : ${DB_URL}`))
.catch(err => console.error('Failed to connect to MongoDB', err)) //Capturamos si surge un error

//MIDDLEWARES
app.use(morgan("dev"))
app.use(express.json())

//PETICION HACIA LA RUTA RAIZ
app.get('/', (req, res) => {  //GET = LEER DATOS. POST = ENVIAR DATOS. PUT = ACTUALIZAR DATOS. DELETE = BORRAR DATOS
    res.send('Hola Mundo!')
})

export default app;