import {Router} from 'express';
import { createTweet, deleteTweet, getTweet, updateTweet } from '../controllers/tweet.controller.js';


const router = Router();


router.route('/createtweet').post(createTweet);

router.route('/deltweet/:tweetId').get(deleteTweet);

router.route('/updatetweet/:tweetId').post(updateTweet);

router.route('/getTweet').get(getTweet);

export default router;