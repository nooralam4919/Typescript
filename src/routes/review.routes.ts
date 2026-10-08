import { Router } from "express";
import { ReviewController } from "../controllers/ReviewController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/query").post(verifyJWT, ReviewController);

export default router;
