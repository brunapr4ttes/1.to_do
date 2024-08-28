import { Router } from "express";
import { getTarefa, getAll, create} from "../controllers/tarefaController.js"

const router = Router()

router.get("/", getAll);
router.post("/", create);
router.get("/:id", getTarefa);

export default router;