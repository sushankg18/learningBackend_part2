import { asyncHandler } from "../utils/asyncHandler";


export const verifyJwt =asyncHandler( async(req, res, next) =>{
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

})