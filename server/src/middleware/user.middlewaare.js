import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../model/user.model.js';

const verifyJWT = asyncHandler(async(req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if(!token){
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if(!decodedToken){
    throw new ApiError(500, "Unable to decode the token");
  }

  const user = await User.findById(decodedToken._id).select("-password -refreshToken");

  if(!user){
    throw new ApiError(401, "Invalid Access Token");
  }

  req.user = user;
  next();
})

export {verifyJWT}