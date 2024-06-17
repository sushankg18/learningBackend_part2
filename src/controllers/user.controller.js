import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiErrors.js'
import User from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
const resgisterUser = asyncHandler( async (req, res)=>{
    // register user
    res.status(200).json({message : "OKAY working"})

    const {fullname, email, password, userName}= req.body
    console.log("Full name : ",fullname)


    if([fullname,email,password,userName].some((field)=> field?.trim === "")){
        throw new ApiError(400, "All fields are required.!")
    }

    const existedUser =User.findOne({
        $or : [ {userName}, {email}]
    })

    if (existedUser){
        throw new ApiError(409,"User already exist")
    }

    const avtarLocalPath = req.files?.avtar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avtarLocalPath){
        throw new ApiError(400, "Avtar is required.!")
    }

    const avtar = await uploadOnCloudinary(avtarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avtar){
        throw new ApiError(400, "Avtar file is required")
    }

    User.create({
        userName : userName.toLowerCase(),
        password,
        fullname,
        email,
        avtar : avtar.url,
        coverImage : coverImage?.url || ""
    })
    
})

export {resgisterUser}