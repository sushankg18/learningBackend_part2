import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "./constants";







/*
import express from 'express'
const app = express()

( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("Error", (error)=>{
            console.log("Error",error)
        })
        
        app.listen(process.env.PORT , ()=>{
            console.log(`App is running on Port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR : ",error)
    } 
})()
*/