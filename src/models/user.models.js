import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            reqiured: true,
            unique: true,
            lowercase: true,
            trim: true, //trim is used for removing the spaces
            index: true //index is used for searching
        },
        fullname: {
            type: String,
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        avatar: {
            type: String, //from cloudinary url
            required: true
        },
        coverImage: {
            type: String, //from cloudinary url
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: true,
        },
        refreshTokens: {
            type: String
        }
    }
    , { timestamps: true }
)

// we are using pre hooks to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) { // this.isModified is used to check if the password is modified or not

 //here we have to use await other wise password will show exactly same in db  as user entered while creation.
        this.password = await bcrypt.hash(this.password, 10) //if the password is modified then we are hashing it using bcrypt
        next();
    } else {
        return next(); //if the password is not modified then we are returning the next function
    }
})

userSchema.methods.isPasswordCorrect = async function (password) { //this is a method which is used to check if the password is correct or not
    return await bcrypt.compare(password, this.password) //we are comparing the password with the hashed password
}

userSchema.methods.generateAccessToken = function () {
    jwt.sign({
        _id: this._id,
        userName: this.userName,
        email: this.email,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema) 
// In mongodb database we are creating a collection named User and we are using the userSchema to define the structure of the collection