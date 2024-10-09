import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiErrorHandler from "../Utils/ApiErrorHandler.js";
import {User} from "../Models/user.model.js"
import  uploadFile  from '../Utils/clodinary.js'
import ApiResponseHandler from "../Utils/ApiResponseHanler.js";

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
        Avatar : avatar_url,
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
    .json(
        new ApiResponseHandler(200 , {AccessToken , user } ,"user logged in successfully")
    )
    ;

} )

const UserLogout = AsyncHandler ( async (req , res )=> {

    const userId = req.user._id;

    const user  = await User.findById(userId);

    const options = {
        httpOnly : true ,
        secure : true
    }

    user.refreshToken = undefined;

    await user.save({validateBeforeSave : false})

    res.clearCookie("AccessToken" , options)
    .json(new ApiResponseHandler(200 , "User has been logged out" , {}))

} )

export {UserRegister , UserLogin , UserLogout}