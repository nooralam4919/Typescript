import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asynHandle.js";
import { Request, Response } from "express";
import { questionChucking } from "../../services/QuestionChuncking.service.js";
import { vectorSearch } from "../../utils/vectorSearch.js";
import { llmCallTogetHumanAns } from "../../services/LLMCalling.service.js";

const QuaryRouterController = asyncHandler(async (req: Request, res: Response) => {

    // projectId scopes the vector search to one repo only.
    // Without it, answers can bleed across all scanned repositories.
    const { question, projectId } = req.body;

    if (!question)
        throw new ApiError(400, "question is required");

    console.log("Question:", question);
    console.log("Project scope:", projectId ?? "all repos (no projectId)");

    // 1. Embed the question
    const QuestionEmbedding = await questionChucking(question);

    if (!QuestionEmbedding)
        throw new ApiError(500, "Failed to generate question embedding");

    // 2. Vector search — scoped to projectId if provided
    const result = await vectorSearch(QuestionEmbedding.data, 5, projectId);

    if (!result || result.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                { answer: "No relevant code was found in the scanned repository. Please make sure you have scanned a repository first." },
                "No context found"
            )
        );
    }

    // 3. Build context from retrieved chunks
    const context = result
        .map((r: any) => r.content)
        .join("\n\n---\n\n");

    // 4. Call LLM with question + context
    const llmResponse = await llmCallTogetHumanAns(question, context);

    res.status(200).json(
        new ApiResponse(
            200,
            { answer: llmResponse?.answer ?? llmResponse },
            "Review complete"
        )
    );
});

export { QuaryRouterController };
