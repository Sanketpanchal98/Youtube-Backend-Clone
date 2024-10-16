import { playListModel } from '../Models/playlist.model.js'
import AsyncHandler from '../Utils/AsyncHandler.js'
import ApiErrorHandler from '../Utils/ApiErrorHandler.js'
import ApiResponseHandler from '../Utils/ApiResponseHanler.js'

//playlist constroller is completed

const createPlayList = AsyncHandler( async(req , res) => {

    const { name , description } = req.body

    if(!(name && description)) {
        throw new ApiErrorHandler(400 , "Data is required ")
    }

    const createdPlayList = await playListModel.create(
        {
            name,
            description,
            owner : req.user._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Play List is created suucessfully" , createdPlayList)
    )

})

const addVideoToPLaylist = AsyncHandler (async (req, res) => {

    //First Approach - 
        //get videoId and playListid from params Query
        //push videoId in playlist video id array 
        //save playlist model
        //return response


    const { v , pl } = req.query

    if(!(v && pl)){
        throw new ApiErrorHandler(404 , "no matching data found")
    }

    const playList = await playListModel.findById(pl);

    if(!playList){
        throw new ApiErrorHandler(404 , "no any playlist named this")
    }

    playList.playListVideoId.push(v);

    await playList.save()

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "video added successfully to the playlist ", playList)
    )

})

const deleteVideoFromPLaylist = AsyncHandler ( async (req , res) => {

    const { v , pl } = req.query
    
    const playList = await playListModel.findById(pl);

    if(!playList){
        throw new ApiErrorHandler(404 , "no any playlist named this")
    }

    if(!playList.playListVideoId.includes(v)){
        throw new ApiErrorHandler(404 , "no any video named this")
    }

    const indexofVideo = playList.playListVideoId.indexOf(v);

    playList.playListVideoId.splice(indexofVideo , 1);
    await playList.save();

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "video removed successfully")
    )

})

export{
    createPlayList,
    deleteVideoFromPLaylist,
    addVideoToPLaylist
}