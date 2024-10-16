import mongoose, { Schema } from "mongoose";


const commentSchema = new Schema({

    video : {
        type : Schema.Types.ObjectId ,
        ref : 'Video'
    }
    ,
    owner : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    content : {
        type : String,
        required : true
    },

    tweet : {
        type : Schema.Types.ObjectId,
        ref : 'Tweet'
    }

},
    {
        timestamps : true
    }
) 


export const Comment = mongoose.model('Comment' , commentSchema);