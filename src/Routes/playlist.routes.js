import { Router } from "express";
import {createPlayList} from '../controllers/playlist.controller.js' 


const router = Router();


router.route('/createPlaylist').post(createPlayList)


export default router