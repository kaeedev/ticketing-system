import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

//Conectarnos a la base de datos local

mongoose.connect('mongodb://localhost:27017/ticketing-db')
.then(() => console.log('💾 Connected to DB'))
.catch(err => console.log('❌ Failed to connect to MongoDB', err))

const users= [
    {
        name: 'user', role: 'user', email: 'user@gmail.com', password: '12345678'
    },
    {
        name: 'admin', role: 'admin', email: 'admin@gmail.com', password: '12345678'
    },
]

const status = ["open", "in-progress", "closed"]
const priorities = ["high", "medium", "low"]

async function deleteCollection() { //Para borrar la base de datos y que quede limpia antes de empezar a trabajar
    await User.deleteMany({})
    console.log('🗑️ Users collection deleted')
    await Ticket.deleteMany({})
    console.log('🗑️ Tickets collection deleted')
}

async function createUsers() { //Creamos usuarios a partir del array users
    for (const userData of users) {
        const user = new User (userData)
        await user.save()
    }
}

async function createTickets() { //Creamos tickets aleatorios
    const users = await User.find({})

    for (let i = 0; i < 15; i++){
        const ticket = new Ticket({
            title: `Ticket #${i}`,
            description: `This is a description for Ticket #${i}`,
            status: status[Math.floor(Math.random() * status.length)], //Cogerá entre open o close
            priorities: priorities[Math.floor(Math.random() * status.length)],
            user: users[Math.floor(Math.random() * users.length)].id //generamos ids randoms
        })

        await ticket.save()
    }

}

async function populateDB() {
    await deleteCollection()
    await createUsers()
    await createTickets()
    console.log('🚀 Database populated')
    mongoose.disconnect()
}

populateDB()


//ESTO ES SIEMPRE APUNTANDO A LA ABSE DE DATOS LOCAL, NO LA BASE DE DATOS DE PRODUCCION