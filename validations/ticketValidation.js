import Joi from "joi";

const ticketSchema = Joi.object({ //Debemos indicarle aqui que forma tiene que tener este ticket para que sea valido
    user: Joi.string().required(),
    title: Joi.string().min(3).required(), //Minimo 3 caracteres y obligatorio
    description: Joi.string().min(5).required(),
    priority: Joi.string().valid("low", "medium", "high").required(), //Solo son validos los 3 parametros esos
    status: Joi.string().valid("open", "in-progress", "closed")
}) 

export default ticketSchema