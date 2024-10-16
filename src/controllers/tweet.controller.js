import { tweetModel } from '../Models/tweet.model.js'
import AsyncHandler from '../Utils/AsyncHandler.js'
import ApiErrorHandler from '../Utils/ApiErrorHandler.js'
import ApiResponseHandler from '../Utils/ApiResponseHanler.js'

//tweet constroller is finished

//1. Create a tweet
//2. Update a tweet
//3. delete a tweet

const createTweet = AsyncHandler (async (req , res) => {
    const { Content } = req.body

    if(!Content){
        throw new ApiErrorHandler(400, "Content is required");
    }

    const tweet = await tweetModel.create(
        {
            content : Content,
            owner : req.user._id
        }
    );

    return res
    .status(200)
    .json(
        new ApiResponseHandler(
            200,
            "Tweet created successfully",
            tweet
        )
    )

})

const updateTweet = AsyncHandler (async (req , res) => {
    const { tweetId } = req.params
    const { Content } = req.body

    if(!Content){
        throw new ApiErrorHandler(400, "Content is required");
    }

    const tweet = await tweetModel.findByIdAndUpdate(
        {
            tweetId
        },
        {
            Content
        },
        {
            new : false
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponseHandler(
            200,
            "Tweet updated successfully",
            tweet
        )
    )

})


const deleteTweet = AsyncHandler (async (req , res) => {

    const { tweetId } = req.params

    const tweet = await tweetModel.findByIdAndDelete(
        {
            tweetId,
            user : req.user._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponseHandler(
            200,
            "Tweet deleted successfully",
            tweet
        )
    )

})

const getTweet = AsyncHandler (async (req , res) => {

    const tweet = await tweetModel.find();

    return res
   .status(200)
   .json(
        new ApiResponseHandler(
            200,
            "All tweets fetched successfully",
            tweet
        )
   )

})

export { createTweet , updateTweet , deleteTweet ,getTweet }