import "dotenv/config";
import express from "express";
import cors from "cors";

//importação das rotas
import tarefaRouter from "./routes/tarefaRouter.js"

const PORT = process.env.PORT || 3333

const app = express()

//3 middlewares
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Utilizar rotas
app.use("/tarefas", tarefaRouter)

app.get((request, response)=>{
    response.status(404).json({message: "Rota não encontrada"})
})

app.listen(PORT, ()=>{
    console.log(`SERVIDOR ON  http://localhost:${PORT}`)
})