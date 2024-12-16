//TESTEAMOS LA API DE USUARIOS SI FUNCIONA
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import server from "../server.js"
import User from "../models/User.js";


//Estructura del test
describe("Users API", () => {
    beforeAll(async () => {
        await User.deleteMany()
    }) //Antes de todo los test, realizamos cierta accion. Por ejemplo, borrar los usuarios de la base de datos de los test para q este limpio

    afterAll( async () => {
        server.close()
        await mongoose.connection.close()
    }) //Despues de que se ejecuten todos los test. En este caso cerramos la coenxion con el server de test


    test("Create a new user", async () => {  //Nombre descriptivo para saber de que estamos haciendo el test
        const response = await request(app).post("/api/users/signup").send({
            name: 'Test user',
            email: 'test@gmail.com',
            password: '12345678',
            role: 'user'
        })

        expect(response.status).toBe(201) //Una vez ejecutado lo anterior, esperamos que el estatus sea 201 (que todo ha ido bien)
        expect(response.body).toHaveProperty("user") //Una vez ejecutado lo anterior, comprobamos que en el cuerpo de la respuesta contenga un user
        expect(response.body).toHaveProperty("token") // '''''', comprobamos que el cuerpo de la respuesta contenga un token
        //SI TODOS LOS EXPECT PASAN Y SON CORRECTOS, EL TEST HA PASADO. SI UNO DE ELLOS NO SE CUMPLE, EL TEST FALLA
    })

    test("Login user", async () => {
        const response = await request(app).post("/api/users/login").send({
            email: 'test@gmail.com',
            password: '12345678'
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("token")
    })
})