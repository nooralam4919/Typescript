import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynHandle.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import { askReviewEngineService } from "../services/ReviewService.js";

const ReviewController = asyncHandler(async (req: Request, res: Response) => {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
        throw new ApiError(400, "A valid question is required");
    }

    console.log("🔥 ReviewController received question:", question);

    const response = await askReviewEngineService(question);

    console.log("🔥 Response from Review Engine:", response);

    res.status(200).json(
        new ApiResponse(
            200,
            { response },
            "Review response received"
        )
    );
});

export { ReviewController };
