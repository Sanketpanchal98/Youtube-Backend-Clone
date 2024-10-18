import AsyncHandler from '../Utils/AsyncHandler.js'
import ApiErrorHandler from '../Utils/ApiErrorHandler.js'
import ApiResponseHandler from '../Utils/ApiResponseHanler.js'
import { Like } from '../Models/likes.model.js';
import Mongoose from 'mongoose' 

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
                    video : new Mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup : {
                    from : 'users',
                    localField : 'likedby',
                    foreignField : '_id',
                    as : 'likedby',
                    pipeline : [
                        {
                            $project : {
                                username : 1,
                                fullName : 1,
                                Avatar : 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields : {
                    countoflikes : {
                        $size : '$likedby'
                    }
                }
            }
        ]
    )

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , `total likes are ${like.length}` , like)
    )

});

const fetchTweetLikes = AsyncHandler ( async ( req , res) => {

    const { tweetId } = req.params;

    const like = await Like.aggregate(
        [
            {
                $match : {
                    tweet : new Mongoose.Types.ObjectId(tweetId)
                }
            },
            {
                $lookup : {
                    from : 'users',
                    localField : 'likedby',
                    foreignField : '_id',
                    as : 'likedby',
                    pipeline : [
                        {
                            $project : {
                                username : 1,
                                fullName : 1,
                                Avatar : 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields : {
                    countoflikes : {
                        $size : '$likedby'
                    }
                }
            }
        ]
    )

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Likes fetched successfully" , like)
    )

});

const fetchCommentLikes = AsyncHandler ( async ( req , res) => {

    const { commentId } = req.params;

    const like = await Like.aggregate(
        [
            {
                $match : {
                    tweet : new Mongoose.Types.ObjectId(commentId)
                }
            },
            {
                $lookup : {
                    from : 'users',
                    localField : 'likedby',
                    foreignField : '_id',
                    as : 'likedby',
                    pipeline : [
                        {
                            $project : {
                                username : 1,
                                fullName : 1,
                                Avatar : 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields : {
                    countoflikes : {
                        $size : '$likedby'
                    }
                }
            }
        ]
    )

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Likes fetched successfully" , like)
    )

});


export {
    likeVideo,
    likeTweet,
    likeComment,
    fetchVideoLikes,
    fetchTweetLikes,
    fetchCommentLikes
}