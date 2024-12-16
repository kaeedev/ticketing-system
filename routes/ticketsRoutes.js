import express from 'express'
import Ticket from '../models/Ticket.js'
import auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'
import pagination from '../middlewares/pagination.js'
import buildFilter from "../middlewares/filter.js"
import ticketSchema from '../validations/ticketValidation.js'

const router = express.Router()

//Ruta para leer todos los tickets de la base de datos en ese momento. 
// GET /api/tickets
// GET /api/tickets?page=1&pageSize=10
// GET /api/ticketsstatus=open&priority=high
// GET /api/tickets?search=bug
router.get('/', buildFilter, pagination(Ticket), async (req, res) => {
    res.status(200).json(req.paginatedResults)
})

//Ruta para crear un nuevo ticket. POST /api/tickets. Usamos nuestro validador
router.post('/', auth, async(req, res) => {

    const {error} = ticketSchema.validate(req.body)
    if(error) {
        return res.status(400).json({message: error.details[0].message})
    }

    const ticket = new Ticket({
        user: req.user._id, //De esta manera no le pasamos el id del usuario pero con la cabecera user si gracias al middleware auth
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status
    })

    try{
        const newTicket = await ticket.save() //Guardamos el ticket creado en la base de datos
        res.status(201).json({ticket: newTicket})

    } catch (err) {
        res.status(500).send({message: 'Server Error' + err.message})
    }

})

//Ruta para leer un ticket en especifico, le debemos pasar el id ya que sera dinamico. GET /api/tickets/:id
router.get('/:id', async (req, res) => {
    try {   
        //const ticket = await Ticket.findById(req.params.id) Buscará por ID el id que hayamos puesto. Solo sirve si usamos los id de mongodb
        const ticket = await Ticket.findOne ({id: req.params.id}) //Busca uno que cumpla los requisitos en los parentesis
        if(!ticket) {
            return res.status(400).json({message: 'Ticket not found'})
        }

        res.status(200).json({ticket: ticket})
    } catch(err) {
        res.status(500).send({message: 'Server Error' + err.message})
    }
})

//Ruta para modificar un ticket en especifico. PUT /api/tickets/:id
router.put('/:id', auth, async (req, res) => {
    const updates = req.body

    try{
        const ticket = await Ticket.findOneAndUpdate(req.params.id, updates, {new:true}) //Metodo para buscar por el id que pongamos y actualizarlo. Si el ticket no existe lo crea
        if(!ticket) {
            return res.status(400).json({message: 'Ticket not found'})
        }
        res.status(200).json({ticket: ticket}) //Ticket actualizado 
    } catch (err) {
        res.status(500).send({message: 'Server Error' + err.message})
    }
})

//Ruta para borrar un ticket en especifico. DELETE /api/tickets/:id
router.delete('/:id', [auth, admin], async(req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({id: req.params.id}) //Metodo para buscar por el id que pongamos y lo borra
        if(!ticket) {
            return res.status(400).json({message: 'Ticket not found'})
        }
        res.status(200).json({ticket: ticket}) //Ticket que acabamos de borrar. Ya no va a estar en la base de datos

    } catch (err) {
        res.status(500).send({message: 'Server Error' + err.message})
    }
})


export default router