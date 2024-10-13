import jwt from "jsonwebtoken"
import { User } from "../Models/user.model.js";
import ApiErrorHandler from "../Utils/ApiErrorHandler.js";

export const cookieFetcher = async (req , res , next) =>  {
    try {
        const AccessToken = await req.cookies.AccessToken 
    
        if(!AccessToken) throw new ApiErrorHandler(401 , "unAuthorized req")
    
        const options = {
            secure : true ,
            httpOnly : true
        }
        
        const decodedCookie = jwt.verify(AccessToken , process.env.ACCESS_TOKEN_SECRET , options);
            
        const user = await User.findById(decodedCookie._id).select("-password -refreshToken");
            
        req.user = user
          
        next();
        
    } catch (error) {
        console.log(error)
    }

}