import "dotenv/config"
import express from 'express'
import morgan from "morgan"

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.get('/', (req, res) => {  //GET = LEER DATOS. POST = ENVIAR DATOS. PUT = ACTUALIZAR DATOS. DELETE = BORRAR DATOS
    res.send('Hola Mundo!')
})

export default app;