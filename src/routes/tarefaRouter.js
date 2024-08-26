import { Router } from "express";
import {getAll} from "../controllers/tarefaController.js"

const router = Router()

router.get("/", (request, response)=>{
    response.status(404).json({message: "Rota"})
})

export default router;