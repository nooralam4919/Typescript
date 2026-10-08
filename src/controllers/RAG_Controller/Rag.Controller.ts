import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asynHandle.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { vectorSearch } from '../../utils/vectorSearch.js'

export const RagController = asyncHandler( async (req: Request, res: Response) => {
        // console.log("FULL BODY:", req.body);

        const { content } = req.body;

        // console.log("CONTENT:", content);
        // console.log("TYPE:", typeof content);
        // console.log("IS ARRAY:", Array.isArray(content));

        console.log("this is in my backend", content);

        const results = await vectorSearch(content, 5);
        console.log("Vector search results:", results);



        return res.status(200).json(
            new ApiResponse(
                200,
                results,
                "Vector search completed successfully"
            )
        );
    }
);