import { Router } from "express";
import {create} from "../controllers/tarefaController.js"

const router = Router()

// router.get("/", getAll);
router.post("/", create)

export default router;