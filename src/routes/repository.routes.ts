import { Router } from "express";
import { getRepositories } from "../controllers/Github.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {RepoRequest} from "../controllers/RepositoryController.js"

const router = Router();

router.route("/repos").get(verifyJWT, getRepositories);
router.route("/repository").post(verifyJWT, RepoRequest);

export default router;