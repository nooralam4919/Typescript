import { asyncHandler } from "../utils/asynHandle.js";
import { ApiError } from "../utils/ApiError.js";
import { Request, Response } from "express";
import {RepositoryService} from "../services/RepositoryService.js"
import prisma from "../lib/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const getRepositories  = asyncHandler(async(req:Request, res:Response) => {
    const userId = req.userId;

    if(!userId)
        throw new ApiError(400, "user id is not found in githhub controller");

    const githubAccount = await prisma.githubAccount.findUnique({
        where: {
            userId: userId
        }
    })

    if(!githubAccount)
        throw new ApiError(400, "github account is found in git controller");

    const githubAccountToken = githubAccount.accessToken;

    if(!githubAccountToken)
        throw new ApiError(400, "github access token is not found");

     const repositories = await RepositoryService(githubAccountToken);

     res.status(200).json(
        new ApiResponse(200, 
            repositories,
            "success in getting repositories"
        )
     )
            
})