import "dotenv/config"
import express from 'express'
import morgan from "morgan"
import mongoose from "mongoose"
import helmet from "helmet"
import cors from "cors"
import compression from "compression"
import limiter from "express-rate-limit"
import usersRoutes from './routes/usersRoutes.js'
import ticketsRoutes from './routes/ticketsRoutes.js'
import error from "./middlewares/error.js"

//DEFINIMOS LA APP
const app = express()

//BASE DE DATOS
const DB_URL = process.env.NODE_ENV === 'test' ? "mongodb://localhost:27017/ticketing-db-test" : process.env.DB_URL || "mongodb://localhost:27017/ticketing-db"
mongoose.connect(DB_URL)
.then(() => console.log(`Connected to DB : ${DB_URL}`))
.catch(err => console.error('Failed to connect to MongoDB', err)) //Capturamos si surge un error

//MIDDLEWARES QUE UTILIZAMOS
app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
if (process.env.NODE_ENV === "prod") {
    app.use(compression())
    app.use(limiter())
}
app.use(express.json())

//PETICION HACIA LA RUTA RAIZ
app.get('/ping', (req, res) => {  //GET = LEER DATOS. POST = ENVIAR DATOS. PUT = ACTUALIZAR DATOS. DELETE = BORRAR DATOS
    res.send('pong')
})

//PETICION HACIA LA RUTA USUARIOS
app.use('/api/users', usersRoutes)

//PETICION HACIA LA RUTA TICKETS
app.use('/api/tickets', ticketsRoutes)

//MIDDLEWARE DE ERROR EN EL CASO DE QUE HAYA ALGUN ERROR LO MANEJE
app.use(error)

export default app;