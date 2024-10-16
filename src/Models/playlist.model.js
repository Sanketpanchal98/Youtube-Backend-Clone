import mongoose , {Schema} from "mongoose";


const playListSchema = new Schema({

    name : {
        type : String,
        required : true
    },

    description : {
        type : String,
    },

    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    playListVideoId : [{
        type : Schema.Types.ObjectId,
        ref : 'Video'
    }]

},
    {
        timestamps : true
    }
);


export const playListModel = mongoose.model('PlayList' , playListSchema);