import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import uploadOnCloundinary from "../utils/cloudinary.service.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  // storing refresh token in database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  // get data from frontend
  // validation
  // check if user already exist
  // check for images
  //upload image on cloudinary
  // again check image
  // create user object
  // remove password and refresh token field from response
  // check if user is created successfully
  //return  response

  const { username, email, password, fullname } = req.body;
  console.log(username);
  if (
    [username, email, password, fullname].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already Exist");
  }
  const avatarPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avatarPath) {
    throw new ApiError(400, "No path Avatar is required");
  }

  const avatarUrl = await uploadOnCloundinary(avatarPath);
  const coverImageUrl = await uploadOnCloundinary(coverImagePath);

  if (!avatarUrl) {
    throw new ApiError(400, "No Url Avatar is required");
  }

  const user = await User.create({
    username,
    email,
    fullname,
    avatar: avatarUrl,
    coverImage: coverImageUrl || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }
  console.log(req);
  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "User has been created"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Extract username and password
  // username exist with same password
  // generte access and refresh token
  // send tokens as secure cookie
  const { username, password } = req.body;

  console.log(username);
  console.log(password);
  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(400, "username is not correct");
  }

  const isCorrectPass = await user.isCorrectPassword(password);
  if (!isCorrectPass) {
    throw new ApiError(401, "Password is not correct");
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken();

  // cookie options

  const options = {
    httpOnly: true, // it means cookies are only modifyable by server
    secure: true,
  };
  const resData = await User.findOne({ username }).select(
    "-password -refreshToken"
  );
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: resData,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._Id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // it returns the new updated value
    }
  );

  const options = {
    httpOnly: true, // it means cookies are only modifyable by server
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // we use req.body because mobile applicationns not have cookies
    const incommingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const user = await User.findById(decodedToken?._Id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    // match whether incoming token and database token is same or not

    if (incommingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user);

    const opitons = {
      httpOnly: true,
      secure: true,
    };

    // send new token
    res
      .status(200)
      .cookie("accessToken", accessToken, opitons)
      .cookie("refreshToken", refreshToken, opitons)
      .json(
        new ApiResponse(200, {
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
