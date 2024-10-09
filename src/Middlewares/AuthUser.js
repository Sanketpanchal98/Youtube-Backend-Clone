import jwt from "jsonwebtoken"
import { User } from "../Models/user.model.js";

export const cookieFetcher = async (req , res , next) =>  {
    const AccessToken = req.cookies.AccessToken 

    const options = {
        secure : true ,
        httpOnly : true
    }

    const decodedCookie = jwt.verify(AccessToken , process.env.ACCESS_TOKEN_SECRET , options);

    const user = await User.findById(decodedCookie._id).select("-password -refreshToken");

    req.user = user

    next();

}