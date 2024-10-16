import AsyncHandler from '../Utils/AsyncHandler.js'
import ApiErrorHandler from '../Utils/ApiErrorHandler.js'
import ApiResponseHandler from '../Utils/ApiResponseHanler.js'
import { Like } from '../Models/likes.model.js';

//1. Like a video controller
//2. Like a comment controller
//3. Like a tweet controller
//4. fetch video likes with count
//5. fetch tweet likes with count
//6. fetch comment likes with count



const likeVideo = AsyncHandler ( async ( req , res) => {

    const { videoId } = req.params

    if(!videoId){
        throw new ApiErrorHandler(404 , "Video not found");
    }

    const like = await Like.create({
        video : videoId,
        likedby : req.user._id
    });

    if(!like){
        throw new ApiErrorHandler(500 , "Internal server problem try again later");
    }

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Liked suuccssfully" , like)
    )

})

const likeTweet = AsyncHandler ( async ( req , res) => {

    const { tweetId } = req.params

    if(!tweetId){
        throw new ApiErrorHandler(404 , "Video not found");
    }

    const like = await Like.create({
        tweet : tweetId,
        likedby : req.user._id
    });

    if(!like){
        throw new ApiErrorHandler(500 , "Internal server problem try again later");
    }

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Liked suuccssfully" , like)
    )

})

const likeComment = AsyncHandler ( async ( req , res) => {

    const { commentId } = req.params

    if(!commentId){
        throw new ApiErrorHandler(404 , "Video not found");
    }

    const like = await Like.create({
        comment :  commentId,
        likedby : req.user._id
    });

    if(!like){
        throw new ApiErrorHandler(500 , "Internal server problem try again later");
    }

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Liked suuccssfully" , like)
    )

})

const fetchVideoLikes = AsyncHandler ( async ( req , res) => {

    const { videoId } = req.params;

    const like = await Like.aggregate(
        [
            {
                $match : {
                    video : videoId
                }
            },
            {
                $addFields : {
                    countoflikes : {

                    }
                }
            }
        ]
    )

});