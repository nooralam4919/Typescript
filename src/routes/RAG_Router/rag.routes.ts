import { Router } from "express";
import { RagController } from '../../controllers/RAG_Controller/Rag.Controller.js'

const router = Router();

router.route("/search").post(RagController);

export default router;