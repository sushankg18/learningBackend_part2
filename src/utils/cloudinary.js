import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null
        }else{
           const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type : "auto"
            });
            //file has been uploaded successfully on cloudinary
            // console.log("FILE UPLOADED ON CLOUDINARY SUCCESSFULLY", response.url);
            fs.unlinkSync(localFilePath) // delete the file from local storage after uploading on cloudinary
            return response
        }
    } catch (error) {
        fs.unlinkSync(localFilePath) // delete the file from local storage if opeartion got failed
        return null
    }
}

export {uploadOnCloudinary}
