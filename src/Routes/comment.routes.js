import { Router } from 'express';
import { createCommentTweet, createCommentVideo, deleteComment, fetchTweetComment, fetchVideoComment, updateComment } from '../controllers/comment.controller.js';
const router = Router();


router.route('/createcommentVideo/:videoId').post(createCommentVideo);

router.route('/commnetontweet/:tweetId').post(createCommentTweet);

router.route('/deletecomment/:commentId').get(deleteComment);

router.route('/update/:commentId').get(updateComment)

router.route('/getcommentv/:videoId').get(fetchVideoComment);

router.route('/getcommentt/:tweet').get(fetchTweetComment);


export default router;