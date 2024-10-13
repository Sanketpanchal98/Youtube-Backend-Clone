import {Video} from "../Models/video.model.js";
import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiResponseHandler from '../Utils/ApiResponseHanler.js'
import ApiErrorHandler from '../Utils/ApiErrorHandler.js'
import uploadFile from '../Utils/clodinary.js'
import deleteCLoudinaryFile from '../Utils/DeletingImg.js'



const uploadVideo = AsyncHandler ( async (req , res) => {

    //taking title and description from user
    //validating title and description
    //accespting video using the multer
    //validating video
    //storing video in clodinary
    //storing data in databse
    //handling response

    const { title , Description } = req.body

    if(!(title && Description)){
        throw new ApiErrorHandler(
            400,
            "All fields must required"
        )
    }

    const videoLocalPath = req.file.path
    console.log(videoLocalPath);
    
    if(!videoLocalPath) {
        throw new ApiErrorHandler(400 , "Video Must required");
    }

    const videoURI = await uploadFile(videoLocalPath);

    const video = await Video.create({
        title,
        Description,
        video : videoURI,
        owner : req.user._id
    });

    return res
    .status(200)
    .json(
        new ApiResponseHandler(
            200,
            "Video uploaded successfully",
            video
        )
    )

} )

const deleteVideo = AsyncHandler (async (req , res) => {

    //getting video name from params
    //requested user from the cookies
    //just comaring userid and video owner id for authorizaation
    //calling delete from clodinary
    //returning res

    const { videoname } = req.params

    const user = req.user._id
    
    if(!videoname){
        throw new ApiErrorHandler(401 , "Video not found")
    }

    const video = await Video.findById(videoname);
    
    if(video.owner == user){
        throw new ApiErrorHandler(401 , "Access denied");
    }
    
    const videoURI = video.video
    
    const result = await deleteCLoudinaryFile(videoURI);
    
    if(!result) {
        throw new ApiErrorHandler(501 , "File is not deleted");
    }

    const deletequery = await Video.deleteOne(video._id);

    if(!deletequery){
        throw new ApiErrorHandler(500 , "internal server problem")
    }

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200,"File deleted successfully" , deletequery)
    )

})

export {
    uploadVideo,
    deleteVideo
}