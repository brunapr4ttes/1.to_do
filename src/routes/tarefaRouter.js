import { Router } from "express";
import { getTarefa, getAll, create, updateTarefa, updateStatusTarefa, burcarTarefaPorSituacao} from "../controllers/tarefaController.js"

const router = Router()

router.get("/", getAll);
router.post("/", create);
router.get("/:id", getTarefa);
router.put("/:id", updateTarefa);
router.patch("/:id/status", updateStatusTarefa);
router.get("/status/:situacao", burcarTarefaPorSituacao);

export default router;