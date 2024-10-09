import mongoose from 'mongoose';
import { DataBase_Name } from '../constants.js';

const connectDb = async ()=>{
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/${DataBase_Name}`);
        console.log("Database connected successfully");
    } catch (error) {
        console.log('Error occured : ' , error);
        throw error;
    }
}

export default connectDb;