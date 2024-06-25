import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiErrors.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'


const generateAccessAndRefreshToken = async (userId) => {
    try {
        console.log("Fetching user by ID:", userId);
        const user = await User.findById(userId);
        console.log("User found:", user);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        console.log("Generating access token...");
        const accessToken = user.generateAccessToken();
        console.log("Access token generated:", accessToken);

        console.log("Generating refresh token...");
        const refreshToken = user.generateRefreshToken();
        console.log("Refresh token generated:", refreshToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error in generateAccessAndRefreshToken:", error);
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}


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
    console.log("Full name : ",fullname)
    console.log("email : ",email)
    console.log("password: ",password)
    console.log("username : ",userName)


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
    
});


const logInUser = asyncHandler(async(req, res)=>{

    // req.body => data
    // username or email
    // find the user
    // password check
    // access and refresh token

    const {userName, email, password} = req.body

    if(!userName && !email){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or : [{userName},{email}]
    })

    if(!user){
        throw new ApiError(404, "User doesn't Exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404, "Invalid password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const LoggedInUser = User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken , options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {user : LoggedInUser, refreshToken, accessToken}, "User logged In Successfully")
    )
})

const logoutUser = asyncHandler(async(req, res)=> {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200, {} , "User logged out successfully"))
})

export {resgisterUser , logInUser , logoutUser}