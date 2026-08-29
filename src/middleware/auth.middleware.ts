import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynHandle.js";

const verifyJWT = asyncHandler(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const token = req.cookies?.accessToken;

        // console.log("ACCESS TOKEN:", token);
        

        if (!token) {
            throw new ApiError(
                401,
                "Access token not found"
            );
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET!
            ) as {
                id: string;
            };

            req.userId = decoded.id;

            next();
        } catch (error) {
            throw new ApiError(
                401,
                "Invalid or expired access token"
            );
        }
    }
);

export { verifyJWT };