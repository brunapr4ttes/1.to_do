import { Router } from "express";
import { getTarefa, getAll, create, updateTarefa} from "../controllers/tarefaController.js"

const router = Router()

router.get("/", getAll);
router.post("/", create);
router.get("/:id", getTarefa);
router.put("/:id", updateTarefa);

export default router;