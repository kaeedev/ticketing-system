import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

//Creamos el modelo Ticket
const ticketSchema = new mongoose.Schema({
    id: {type: String, default: uuidv4, required: true},
    user: {type: String, required: true},
    createAt: {type: Date, default: Date.now},
    status: {type: String, enum: ['open','in-progress','closed'], default:'open'},
    priority: {type: String, enum: ['low','medium','high'], default: 'low'},
    title: {type: String, required: true},
    description: {type: String, required:true}
}, { //Configuramos el JSON que nos devuelve
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v
            delete ret._id
        },
        virtuals: true
    }
})

//Indexamos. Buscaremos por id y por usuarios
ticketSchema.index({id: 1, user: 1})

//Creamos el modelo y exportamos
const Ticket = mongoose.model('Ticket', ticketSchema)

export default Ticket