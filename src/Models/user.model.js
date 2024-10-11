import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username : {
        type : String , 
        required : true,
        lowercase : true,
        unique : true
    },
    email : {
        type : String , 
        required : true,
        lowercase : true,
        unique : true
    },
    fullname : {
        type : String , 
        required : true,
    },
    Avatar : {
        type: String ,
        required : true
    },
    coverimage : {
        type : String
    },
    watchHistory : [{
        type : Schema.Types.ObjectId ,
        ref : "Video"
    }],
    password : {
        type : String ,
        required : true
    },
    refreshToken : {
        type :String
    } 

} , { timestamps : true })

UserSchema.pre("save" ,  async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password , 10);
    next();
})

UserSchema.methods.passwordVerification = function async (password) {
    return bcrypt.compare(password , this.password);
}

UserSchema.methods.Acsessgeneration = function () {
    return jwt.sign({
        username : this.username , 
        _id : this._id,
        fullname : this.fullname
    }, 
    process.env.ACCESS_TOKEN_SECRET ,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY 
    })
}

UserSchema.methods.RefreshGeneration = function () {
    return jwt.sign({
        _id : this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET ,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY 
    })
}

export const User = mongoose.model("User" , UserSchema);