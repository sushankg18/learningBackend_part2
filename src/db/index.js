import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const {MONGODB_URI} = process.env
const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)
        console.log(`Mongo Db connected sucessfully ! DB HOST : ${connectInstance.connection.host}`)
        //here connectInstance convert into object after successful connecting to MONGO db.
    } catch (error) {
        console.log("Error", error);
        throw error
    }
}

export default connectDB