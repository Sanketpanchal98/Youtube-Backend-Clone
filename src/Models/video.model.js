import mongoose from "mongoose";

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
    likes : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    owner : {
        type : Schema.Types.ObjectId , 
        ref : "User"
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

export const Video = mongoose.model('Video' , VideoSchema);