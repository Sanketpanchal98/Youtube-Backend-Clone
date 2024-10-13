import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiErrorHandler from "../Utils/ApiErrorHandler.js";
import {User} from "../Models/user.model.js"
import  uploadFile  from '../Utils/clodinary.js'
import ApiResponseHandler from "../Utils/ApiResponseHanler.js";
import jwt from "jsonwebtoken"
import { options } from "../constants.js";
import deleteCLoudinaryFile from "../Utils/DeletingImg.js";

const AccessAndRefreshTokenGenerator = async (userId) => {

    try {
        const user = await User.findById(userId);
        
        const RefreshToken = user.RefreshGeneration();
        const AccessToken = user.Acsessgeneration()
        
        user.refreshToken = RefreshToken
        
        await user.save({validateBeforeSave : false})
        
        return {AccessToken , RefreshToken}
    } catch (error) {
        throw new ApiErrorHandler(400 , error)
    }

}

const UserRegister = AsyncHandler ( async (req , res ) => {
    //get info from fronyend
    //store in a object
    //validate all fields
    //check for images
    //check whether user exists
    //create a new user
    //check user created or not
    //remove password and refersh token from it
    //return res


    const {fullname , username , password , email} =  req.body

    if(!fullname && !username && !password && !email){
        throw new ApiErrorHandler(400 , "Need every field")
    }

    const avatar = req.files?.Avatar[0]?.path
    let coverimage,coverimage_url;
    if (req.files.Cover>0) {
        coverimage = req.files?.Cover[0]?.path;
        coverimage_url = await uploadFile(coverimage);
    } else {
        coverimage_url = "";
    }
    if(!avatar){
        throw new ApiErrorHandler(400, "All files required including images");
    }

    const avatar_url = await uploadFile(avatar);
   


    const alreadyExists = await User.findOne({username});
    if(alreadyExists){
        throw new ApiErrorHandler(400 , "Username already exists");
    }
    const user = await User.create({
        fullname,
        password,
        username,
        Avatar : avatar_url.url,
        email,
        coverimage : coverimage_url
    })

    res.status(200).json(
        new ApiResponseHandler(200 , user)
    )    

})

const UserLogin = AsyncHandler ( async (req , res ) => {

    //req data
    //check if user exists
    //compare password
    //generate token
    //return res

    const{password , email , username} = req.body

    if(!password){
        throw new ApiErrorHandler(401 , "Passwors require hota hai chutiye!!")
    }
    
    if(!username || !email) {
        throw new ApiErrorHandler(400 , "All fields required");
    }


    const user = await User.findOne({
        $or : [ {username} , {email} ]
    })

    const Loggedin = user.passwordVerification(password);

    if(!Loggedin) throw new ApiErrorHandler(402 , "Password is incorrect");
    
    const {AccessToken , RefreshToken } = await AccessAndRefreshTokenGenerator(user._id);

    const options = {
        httpOnly : true ,
        secure : true
    }
    

    res.status(200)
    .cookie("AccessToken" , AccessToken , options)
    .cookie("RefreshToken" , RefreshToken , options)
    .json(
        new ApiResponseHandler(200 , {AccessToken , user ,RefreshToken} ,"user logged in successfully")
    )
    ;

} )

const UserLogout = AsyncHandler ( async (req , res )=> {

    const userId = req.user._id;

    if(!userId) throw new ApiErrorHandler(401 , "unathorized req");

    const user  = await User.findById(userId);

    const options = {
        httpOnly : true ,
        secure : true
    }

    user.refreshToken = undefined;

    await user.save({validateBeforeSave : false})

    return res.clearCookie("AccessToken" , options)
    .json(new ApiResponseHandler(200 , "User has been logged out" , {}))

} )

const RefreshTokenHandler = AsyncHandler ( async (req , res )=> {

    const incomingAccessToken = req.cookie || req.body.cookie

    if(!incomingAccessToken){
        throw new ApiErrorHandler(401 , "No access Token Providedd");
    }

    const decodedToken = await jwt.verify(incomingAccessToken , process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id);
    console.log(user);
    
    if(!user) throw new ApiErrorHandler(401 , "Invalid Token");

    const refreshToken = user.refreshToken

    // if(refreshToken !== incomingAccessToken) throw new ApiErrorHandler(401 , "Not have access");

    const {RefreshToken , AccessToken} = await AccessAndRefreshTokenGenerator(user._id);

    console.log(RefreshToken);
    

    return res.status(201).cookie("accessToken" , AccessToken , options).cookie("newRefreshToken" , RefreshToken , options).json({refreshToken : RefreshToken,AccessToken : AccessToken})

});

const updateUserPassword = AsyncHandler( async (req , res) => {
    const { oldPassword , newPassword} = req.body;

    if(!(oldPassword && newPassword)) throw new ApiErrorHandler(400 , "passwords are required")
    const user = await User.findById(req.user?._id);

    if(!user.passwordVerification(oldPassword)) throw new ApiErrorHandler(400 , "Old Password is Wrong");

    user.password = newPassword;

    await user.save({validateBeforeSave : false});

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Password updated successfully")
    )
})

const updateUserDetails = AsyncHandler( async (req , res) => {
    const { fullName , email} = req.body

    if(!(fullName && email)) throw new ApiErrorHandler(400 , "Details Must reqired to update");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullname : fullName,
                email 
            }
        },
        {
            new : true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Details Updated successfully" ,user)
    )
})

const updateUserCoverImage = AsyncHandler(async (req , res) => {
    const LocalPathCoverImage = req.files?.coverImage[0]?.path

    if(!LocalPathCoverImage) throw new ApiErrorHandler(400 , "Cover Imge is required");

    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    const CoverImage = await uploadFile(LocalPathCoverImage)

    const CoverimageUrl = user.coverimage

    const result = await deleteCLoudinaryFile(CoverimageUrl);

    if(!result) throw new ApiErrorHandler(500 , "File deleting unsuccessfull");

    user.coverimage = CoverImage
    await user.save({validateBeforeSave : false});

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Sucessfully uploaded" , user)
    )

})

const updateUserAvatar = AsyncHandler( async (req , res) => {
    const localPathAvatar = req.files?.Avatar[0]?.path

    if (!localPathAvatar) {
        throw new ApiErrorHandler(400 , "Avatar is required")
    }

    const Avatar = await uploadFile(localPathAvatar)

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set : {
                Avatar : Avatar
            }
        },
        {
            new : false
        }
    ).select("-password -refreshToken");

    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponseHandler(200 , "Updated Successfully Avatar" ,user)
    )
})

const channelFetcher = AsyncHandler( async (req , res) => {

    const {username} = req.params;

    if(!username?.trim){
        throw new ApiErrorHandler(404 , "No channel found");
    }

    const channelInfo = await User.aggregate([
        {
            $match : {username}
        },
        {
            $lookup : {
                from : "subcriptions",
                localField : "_id",
                foreignField : "subscribedTo",
                as : "subscribedTo"
            }
        },
        {
            $lookup : {
                from : "subcriptions",
                localField : "_id",
                foreignField : "subscribedBy",
                as : "subscribedBy"
            }
        },
        {
            $addFields : {
                subscribedTocount : {
                    $size : "$subscribedTo"
                },
                subscribedBycount : {
                    $size : "$subscribedBy"
                },
                isSubscribed : {
                    $cond : {
                        if : {$in : [req.user?._id , "$subscribedBy.subscribedBy"]} ,
                        then : true,
                        else : false
                    }
                }
            }
        },
        {
            $project : {
                _id : 1,
                username : 1,
                fullname : 1,
                email : 1,
                Avatar : 1,
                coverimage : 1,
                subscribedTocount : 1,
                subscribedBycount : 1,
                isSubscribed : 1
            }
        }
    ]);
    // console.log(channelInfo[0]);
    
    if(!channelInfo.length) throw new ApiErrorHandler(404 , "No channel found of this name");

    return res
   .status(200)
   .json(
     new ApiResponseHandler(200 , "Channel fetched successfully", channelInfo[0])
   )

})

export {UserRegister , 
    UserLogin , 
    UserLogout , 
    RefreshTokenHandler,
    updateUserDetails,
    updateUserPassword,
    updateUserCoverImage,
    updateUserAvatar,
    channelFetcher
}