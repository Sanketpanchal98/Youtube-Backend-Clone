import { Router } from "express";
import { UserLogin, UserLogout, UserRegister } from "../controllers/User.controller.js";
import { upload } from '../Middlewares/Multer.middleware.js'
import { cookieFetcher } from "../Middlewares/AuthUser.js";


const router = Router();

router.route('/register').post(
    upload.fields(
        [
            {
                name: 'Avatar',
                maxCount: 1
            },{
                name: 'Cover',
                maxCount: 1
            }
        ]
    ),
    UserRegister);

router.route('/login').post(UserLogin)

router.route("/logout").post(cookieFetcher , UserLogout);


export default router;