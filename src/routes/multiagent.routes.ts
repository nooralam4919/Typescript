import { Router }                    from "express";
import { MultiAgentReviewController } from "../controllers/MultiAgentController.js";
import { verifyJWT }                  from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/v1/review/multi
router.route("/multi").post(verifyJWT, MultiAgentReviewController);

export default router;
