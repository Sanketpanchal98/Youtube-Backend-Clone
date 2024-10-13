import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({

    subscribedTo : {
        type : Schema.Types.ObjectId ,
        ref : 'User'
    },

    subscribedBy : {
        type : Schema.Types.ObjectId ,
        ref : 'User'
    }

} ,{
    timestamps : true
})





export default Subscription = mongoose.model('Subcription' , subscriptionSchema);