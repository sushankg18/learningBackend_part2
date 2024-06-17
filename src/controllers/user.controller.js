import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiErrors.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
const resgisterUser = asyncHandler( async (req, res)=>{
    // register user
    res.status(200).json({message : "OKAY working"})

    //get user details from frontend
    //validation -not empty
    //check if user already exists -email or username
    //check for images, check for avatar
    //upload them to cloudinary, avatar(mandatory)
    //create user object - create entry in db
    //remove password and refreshTokens fields from response
    //check for user creation
    //return res 

    const {fullname, email, password, userName,}= req.body
    // // console.log("Full name : ",fullname)
    // console.log("email : ",email)
    // console.log("password: ",password)
    // console.log("username : ",userName)


    //here we check if all fields are filled or not
    if([fullname,email,password,userName].some((field)=> field?.trim === "")){
        throw new ApiError(400, "All fields are required.!")
    }

    //here we check if user already exists or not, check by email or username
    const existedUser = await User.findOne({
        $or : [ {userName}, {email}]
    })


    //if user already exists, throw error
    if (existedUser){
        throw new ApiError(409,"User already exist")
    }


    // console.log('Files:', req.files);

    //here we check get the local path of the avatar and cover image
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // here we upside we found bug and resolved below
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    //if avatar is not provided, throw error
    if(!avatarLocalPath){
        throw new ApiError(400, "Avtar is required.!")
    }

    //here we upload the avatar and cover image to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);


    //here if avatar is not provided, throw error
    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }


    //here we create user object by which we will create entry in db
    const user = await User.create({
        userName : userName.toLowerCase(),
        password,
        fullname,
        email,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
    })

    //here we check if user is created or not
    const createdUser = await User.findById(user._id).select("-password -refreshTokens")

    //if user is not created, throw error
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating a User.!!")
    }

    //here we return the response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User regiserted Successfully!!")
    )
    
})

export {resgisterUser}