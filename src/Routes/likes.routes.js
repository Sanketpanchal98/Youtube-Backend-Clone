import { Router } from "express";
import { likeVideo , likeTweet , fetchCommentLikes , likeComment, fetchTweetLikes, fetchVideoLikes} from '../controllers/Likes.controller.js'


const router = new Router();


router.route('/likeV/:videoId').get( likeVideo);

router.route('/likeT/:tweetId').get( likeTweet);

router.route('/likeC/:commentId').get( likeComment);

router.route('/getCL/:commentId').get(  fetchCommentLikes)

router.route('/getTL/:tweetId').get( fetchTweetLikes)

router.route('/getVL/:videoId').get( fetchVideoLikes)


export default router;