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
    likes : {
        type : Number
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

export default Video = mongoose.model('Video' , VideoSchema);