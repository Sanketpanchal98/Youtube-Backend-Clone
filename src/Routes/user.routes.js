import { Router } from "express";
import { channelFetcher, RefreshTokenHandler, updateUserAvatar, updateUserCoverImage, updateUserDetails, updateUserPassword, UserLogin, UserLogout, UserRegister } from "../controllers/User.controller.js";
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

router.route("/RefreshToken").post(RefreshTokenHandler);

router.route("/updatePassword").post(cookieFetcher , updateUserPassword);

router.route("/updateDetails").post(cookieFetcher , updateUserDetails);

router.route("/updateAvatar").post(upload.fields([{name : 'Avatar' , maxCount : 1}]),cookieFetcher , updateUserAvatar);

router.route("/updateCover").post(upload.fields([{name : 'coverImage' , maxCount : 1}]),cookieFetcher , updateUserCoverImage);

router.route("/channel/:username").get(cookieFetcher , channelFetcher);

export default router;