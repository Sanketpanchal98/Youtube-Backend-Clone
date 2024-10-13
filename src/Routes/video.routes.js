import { deleteVideo, uploadVideo } from '../controllers/Video.controller.js'
import { Router } from 'express'
import { upload } from '../Middlewares/Multer.middleware.js'

const router = Router()

router.route('/createVideo').post(upload.single('Video'),uploadVideo);

router.route('/deleteVideo/:videoname').get(deleteVideo);

export default router;