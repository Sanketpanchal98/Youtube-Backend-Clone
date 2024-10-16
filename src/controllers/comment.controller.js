import { Comment } from '../Models/comment.model.js';
import AsyncHandler from '../Utils/AsyncHandler.js'
import ApiErrorHandler from '../Utils/ApiErrorHandler.js'
import ApiResponseHandler from '../Utils/ApiResponseHanler.js'
import Mongoose from 'mongoose';

//1. comment on video
//2. comment on tweet
//3. delete comment
//4. update comment
//5. fetching comments on particular video
//6. fetching comments on specific tweet


const createCommentVideo = AsyncHandler(async (req, res) => {

    //get data from body
    //get is of video from params
    //get user from req.user
    //create comment model with data
    //save comment model
    //return response

    const { content } = req.body
    const { videoId } = req.params
    
    if(!content){
        throw new ApiErrorHandler(400 , "information is required");
    }

    if(!videoId){
        throw new ApiErrorHandler(400 , "video not found");
    }

    const comment = await Comment.create({
        content,
        video : videoId,
        owner : req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "comment is uploaded successfully" ,comment)
    )

})

const createCommentTweet = AsyncHandler(async (req, res) => {

    //get data from body
    //get is of video from params
    //get user from req.user
    //create comment model with data
    //save comment model
    //return response

    const { content } = req.body
    const { tweetId } = req.params
    
    if(!content){
        throw new ApiErrorHandler(400 , "information is required");
    }

    if(!tweetId){
        throw new ApiErrorHandler(400 , "video not found");
    }

    const comment = await Comment.create({
        content,
        tweet : tweetId,
        owner : req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "comment is uploaded successfully" ,comment)
    )

})

const deleteComment = AsyncHandler( async (req , res) => {

    //get comment id from params
    //serach on databse and delte
    //return res

    const {commentId} = req.params

    if(!commentId){
        throw new ApiErrorHandler(404 , "no comment of this id");
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiErrorHandler(404 , "no comment of this id");
    }

    if(!(comment.owner == req.user._id)){
        throw new ApiErrorHandler(401 , "access denied");
    }

    const result = await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Comment deleted sucessfully",result)
    )

})

const updateComment = AsyncHandler( async (req , res) => {

    //get comment id from params
    //serach on databse and delte
    //return res

    const {commentId} = req.params
    const {content} = req.body;

    if(!commentId){
        throw new ApiErrorHandler(404 , "no comment of this id");
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiErrorHandler(404 , "no comment of this id");
    }

    if(!(comment.owner == req.user._id)){
        throw new ApiErrorHandler(401 , "access denied");
    }

    comment.content = content;
    await comment.save();

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Comment deleted sucessfully")
    )

})

const fetchVideoComment = AsyncHandler (async (req , res ) => {

    const { videoId } = req.params

    if(!videoId){
        throw new ApiErrorHandler(400 , "video is required");
    }

    const comments = await Comment.aggregate([
        {
            $match : {
                video : new Mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $project : {
                owner :1,
                content : 1
            }
        }
    ]);
    
    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "comments are found" , comments)
    )

});

const fetchTweetComment = AsyncHandler (async (req , res ) => {

    const { commentId } = req.params

    if(!commentId){
        throw new ApiErrorHandler(400 , "comment is required");
    }

    const comments = await Comment.aggregate([
        {
            $match : {
                tweet : tweetId
            }
        },
        {
            $project : {
                owner :1,
                content : 1
            }
        }
    ]);

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "comments are found" , comments)
    )

});

export {
    fetchTweetComment,
    fetchVideoComment,
    createCommentTweet,
    createCommentVideo,
    deleteComment,
    updateComment
}