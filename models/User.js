import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt"

//ESQUEMA DE MODELO DE USUARIO
const userSchema = new mongoose.Schema({
    id: {type: String, default: uuidv4, required: true, unique: true},
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true, lowercase: true, trim: true}, //trim quita espacios si los hay
    password: {type: String, required: true, minlength: 8},
    role: {Type: String, enum: ['user', 'admin'], default: 'user'}
}, {
    // DECIMOS QUE AL PASAR AL FORMATO JSON NO NOS PASE NI EL __V NI EL _ID QUE LO PONE MONGODB POR DEFECTO Y EN ESTE CASO LAS CONTRASEÑAS DE LOS USUARIOS
    toJSON: {
        transform: function(doc, ret){
            delete ret.__v,
            delete ret._id,
            delete ret.password
        },
        virtuals: true
    }
})

//ENCRIPTACION DE CONTRASEÑAS
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next() //Si la contraseña se ha modificado no hace nada
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt) //Encriptacion
}) //Antes de que se guarde en nuestra base de datos, vamos a decir que las constraseñas no se guarden en claro. La codificamos


//INDICES. NOS SIRVE PARA QUE MONGO PUEDA INDEXAR LOS DOCUMENTOS POR CIERTA PROPIEDAD DE MANERA QUE NOSOTROS PODAMOS BUSCAR LUEGO POR ESA MANERA
//POR EJEMPLO, INDEXAR POR EL ID
userSchema.index({id: 1, email: 1})

//Creamos el modelo usuario y exportamos
const User = mongoose.model('User', userSchema)

export default User