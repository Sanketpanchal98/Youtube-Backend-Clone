import mongoose, { Aggregate } from "mongoose";

const Schema = mongoose.Schema

const VideoSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    Description : {
        type : String,
        required : true,
    },
    video : {
        type : String,
        required : true,
    },
    owner : {
        type : Schema.Types.ObjectId , 
        ref : "User"
    }
} , {timestamps : true});



export const Video = mongoose.model('Video' , VideoSchema);