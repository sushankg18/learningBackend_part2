import { Router } from "express";
import { resgisterUser , logInUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

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

export default router