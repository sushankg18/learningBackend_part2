import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

// Using CORS configuration
app.use(cors({
    origin : process.env.CORS_ORIGIN, // here we get to know which origin is allowed.
    credentials : true,
}))

// Using JSON configuration
app.use(express.json({limit : "16kb"})) //this is used for applying limitation for getting json files
app.use(express.urlencoded({limit : "16kb", extended : true})) 

// Using static configuration
app.use(express.static("public")) 
app.use(cookieParser()) // easy way to use cookieParser.



//router Imports
import userRouter from './routes/user.routes.js'


//router usage
app.use("/api/v1/users", userRouter)
//this url works as http://localhost:3000/api/v1/users



export { app } // this is the best way to use export app.