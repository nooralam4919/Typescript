import { Router } from "express";
import { QuaryRouterController } from "../../controllers/Qury_Controller/Quary.Controller.js"

const router = Router();

router.route('/query').post(QuaryRouterController);

export default router;