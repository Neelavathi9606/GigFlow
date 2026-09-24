import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token");
  }
}

const registerUser = asyncHandler(async (req, res)=> {
  const {name, email, username, contact_no, password} = req.body;

  if([name, email, username, contact_no, password].some((field) => field.trim() === "")){
    throw new ApiError(400, "All the fields are required");
  }

  const isEmailInUse = await User.findOne({email: email});

  if(isEmailInUse){
    throw new ApiError(400, "Email already in use");
  }

  const isUsernameInUse = await User.findOne({username: username});

  if(isUsernameInUse){
    throw new ApiError(400, "Username already in use");
  }
  
  const isContactInUse = await User.findOne({contact_no: contact_no});

  if(isContactInUse){
    throw new ApiError(400, "Contact already in use");
  }

  const user = await User.create({
    name,
    email,
    username: username.toLowerCase(),
    contact_no,
    password
  });

  if(!user) {
    throw new ApiError(500, "Unable to register a user");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "User Registered Successfully"
    )
  )
})

const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  if([email, password].some((field) => field.trim() === "")){
    throw new ApiError(400, "All the fields are required");
  }

  const user = await User.findOne({email: email});

  if(!user){
    throw new ApiError(404, "User with this email does not exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if(!isPasswordCorrect){
    throw new ApiError(400, "Password you entered is wrong");
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

  const updateRefreshToken = await User.findByIdAndUpdate(user._id, {refreshToken: refreshToken});

  if(!updateRefreshToken){
    throw new ApiError(500, "Error updating user's refresh token");
  }

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  if(!loggedInUser){
    throw new ApiError(500, "Error finding logged in user");
  }

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res.status(201)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {user: loggedInUser, accessToken, refreshToken},
      "User Logged in successfully"
    )
  )
})

const logoutUser = asyncHandler(async (req, res) => {
  const {userId} = req.user._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken:1
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse(
      200,
      {},
      "User logged out successfully"
    )
  )
})

export {registerUser, loginUser, logoutUser};