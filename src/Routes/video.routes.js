import { deleteVideo, getAllvideo, likeUnlikeVideo, uploadVideo, watchedVideo } from '../controllers/Video.controller.js'
import { Router } from 'express'
import { upload } from '../Middlewares/Multer.middleware.js'

const router = Router()

router.route('/createVideo').post(upload.single('Video'),uploadVideo);

router.route('/getallvideos').get(getAllvideo);

router.route('/deleteVideo/:videoname').get(deleteVideo);

router.route('/watched/:videoId').get(watchedVideo);

router.route('/likeUnlike/:videoId').get(likeUnlikeVideo);

export default router;