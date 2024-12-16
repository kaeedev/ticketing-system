import request  from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import server from "../server.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

describe("Tickets API", () => {
    let token

    beforeAll(async () => { //Antes de los test, creamos un usuario de pruebas ya que necesitamos el token para hacer tickets. Before all se ejecuta solamente una vez hasta que se ejecuten todos los test dentro de describe
        await User.deleteMany({})
        const response = await request(app).post("/api/users/signup").send({
            name: "Test user",
            email: "test@gmail.com",
            password: "12345678"
        })

        token = response.body.token
    })

    beforeEach(async () => { //BeforeEach se ejecuta antes de cada uno de los test dentro del describe, no como el beforeAll. En este caso limpiamos la base de datos de tickets que pueda haber
        await Ticket.deleteMany({})
    }) 

    afterAll(async () => {
        server.close()
        await mongoose.connection.close()
    })

    test('Create a new ticket', async () => {
        const response = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${token}`) //Le indicamos que el ticket debe tener la siguiente forma
        .send({ //Creamos el ticket
            title: "Test ticket",
            description: "Test ticket description",
            priority: "high",
            status: "open"
        })
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("ticket") //Al ser un json el ticket, primero debemos comprobar que se esta pasando ticket
        expect(response.body.ticket).toHaveProperty("title", "Test ticket") //y luego las propiedades de ticket
        expect(response.body.ticket).not.toHaveProperty("_id") //Le decimos que el ticket debe no tener la propiedad _id ya que esto es el id de mongodb que es el que no queremos
    })

    test('Get all tickets', async () => {
        const ticket1 = await Ticket.create({
            title: "Ticket 1",
            description: "Description 1 ticket",
            priority: "low",
            status: "open",
            user: "test-user-id"
        })

        await ticket1.save()

        const ticket2 = await Ticket.create({
            title: "Ticket 2",
            description: "Description 2 ticket",
            priority: "low",
            status: "open",
            user: "test-user-id"
        })

        await ticket2.save()

        const response = await request(app)
        .get("/api/tickets")

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("results")
        expect(response.body).toHaveProperty("total")
        expect(response.body).toHaveProperty("currentPages")
        
        expect(response.body.total).toBe(2)
        expect(response.body.currentPages).toBe(1)
        expect(response.body.results).toHaveLength(2) //Para que compruebe que hay 2 items
        expect(response.body.results[0]).toHaveProperty("title", "Ticket 1") //Podemos comprobar si un item determinado tiene x propiedades, en este caso titulo 1 el item 0
    })
})