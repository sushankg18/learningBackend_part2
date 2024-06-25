import { Router } from "express";
import { resgisterUser , logInUser, logoutUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1 
        },
        {
            name: "coverImage",
            maxCount : 1
        }
    ]),
    resgisterUser
)

router.route("/login").post(logInUser)

router.route("/logout").post(verifyJwt ,logoutUser)
export default router