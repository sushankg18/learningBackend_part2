import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({path : "./env"})


connectDB() //here we connect the MONGO db
.then(app.listen(process.env.PORT || 3000 , ()=>{ //After connecting we just have to use .then and catch!!! .then is for sucessfully listening the app.
    console.log(`APP RUNNING ON PORT ${process.env.PORT}`)
}))
.catch((error)=>{
    console.log("MONGO DB CONNECTION FAILED", error)
})