import { Router } from "express";
import { register, login, findUser,  uploadFile} from "../../controllers/userController/user.register.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/multer.middleware.js";


const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(verifyJWT, findUser);
router.route("/upload").post(verifyJWT, upload.fields([
    {
        name: "downlodedFile",
        maxCount: 1,
    }
]), uploadFile);


export default router;