import { asyncHandler } from "../../utils/asynHandle.js";
import prisma from "../../lib/prisma.js";
import { comparePassword, hashedPassword } from "../../utils/password.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Request, Response } from "express";
import {generateAccessToken, generateRefreshToken} from '../../utils/jwt.js'
import {uploadOnCloudinay} from '../../utils/cloudnary.js'
import {parseWithDocling} from "../../services/Docling.service.js"


const generateAccessTokenAndRefreshToken = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.email) {
    throw new ApiError(400, "User email is missing");
  }

  const accessToken = generateAccessToken(user.id, user.email);

  const refreshToken = generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
  };
};

const register = asyncHandler(async (req: any, res: any) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const encryptedPassword = await hashedPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: encryptedPassword,
    },
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      "User registered successfully"
    )
  );
});

const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check fields
    if (!email) {
      throw new ApiError(
        400,
        "Email is required"
      );
    }

    if (!password) {
      throw new ApiError(
        400,
        "Password is required"
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Check user
    if (!user) {
      throw new ApiError(401,"Invalid email or password"
      );
    }

    // Check if user has password
    if (!user.password) {
      throw new ApiError(400,"This account does not have a password. Please login with GitHub."
      );
    }

    // Check password
    const isPasswordCorrect = await comparePassword( password, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(401,"Invalid email or password"
      );
    }

    // Generate tokens
    const tokens = await generateAccessTokenAndRefreshToken(user.id);

    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;

    // Store access token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { accessToken },
    });

  
    const cookieOptions = {
      httpOnly: true,   // not accessible via JS — prevents XSS token theft
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax" as const,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in ms
      })
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          },
          "User logged in successfully"
        )
      );
  }
);


const findUser = asyncHandler(
    async (req: Request, res: Response) => {

        const userId = req.userId;

        if (!userId) {
            throw new ApiError(
                401,
                "User is not authenticated"
            );
        }

        const userInfo = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!userInfo) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                userInfo,
                "User found successfully"
            )
        );
    }
);


const githubLogin = asyncHandler(async(req: Request, res: Response) => {
  
  res.status(200).json(
    new ApiResponse(
      300,
      {},
      "got github resposnse"
    )
  )
})



const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        throw new ApiError(401, "User is not authenticated");
    }

    const findUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!findUser) {
        throw new ApiError(400, "User ID is not found");
    }

    const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };


    console.log("FILES RECEIVED:", files);

    const receivedFile = files?.downlodedFile?.[0]?.path;

    const fileToDocling = await parseWithDocling(receivedFile);

        console.log("this is the file and the url", receivedFile, userId); 

    if (!receivedFile) {
        throw new ApiError(400, "No file uploaded");
    }

    console.log("FILE PATH:", receivedFile);

    const uploadedFile = await uploadOnCloudinay(receivedFile);

    if (!uploadedFile) {
        throw new ApiError(
            500,
            "File upload to Cloudinary failed"
        );
    }

    

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userId,
                file: uploadedFile,
                receivedFile

            },
            "File has been uploaded successfully"
        )
    );
});

export { register, login, findUser, githubLogin, uploadFile };