import { Request, Response }      from "express";
import { asyncHandler }            from "../utils/asynHandle.js";
import { ApiError }                from "../utils/ApiError.js";
import { ApiResponse }             from "../utils/ApiResponse.js";
import { questionChucking }        from "../services/QuestionChuncking.service.js";
import { vectorSearch }            from "../utils/vectorSearch.js";
import { callMultiAgentReview }    from "../services/MultiAgentService.js";

// POST /api/v1/review/multi
// Body: { question: string, projectId?: string }
//
// Flow:
//   1. Embed the question (same as the single-agent path)
//   2. Vector search scoped to projectId
//   3. Call review-engine /multiagent/review with question + context chunks
//   4. Return structured multi-agent response to the frontend

const MultiAgentReviewController = asyncHandler(
    async (req: Request, res: Response) => {

        const { question, projectId } = req.body as {
            question:  string;
            projectId?: string;
        };

        if (!question)
            throw new ApiError(400, "question is required");

        console.log("[MultiAgentReview] Question:", question);
        console.log("[MultiAgentReview] Project:",  projectId ?? "all");

        // ── 1. Embed the question ──────────────────────────────
        const embedding = await questionChucking(question);

        if (!embedding)
            throw new ApiError(500, "Failed to generate question embedding");

        // ── 2. Vector search — scoped to project ──────────────
        const chunks = await vectorSearch(embedding.data, 8, projectId);

        if (!chunks || chunks.length === 0) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        answer: "No relevant code was found for this project. Make sure you have scanned a repository first.",
                        agentsUsed: [],
                        plannerMode: "none",
                        plannerReason: "No code context available",
                        severity: { overall: "INFO", critical: 0, high: 0, medium: 0, low: 0, info: 0 },
                    },
                    "No context found"
                )
            );
        }

        // ── 3. Build context string from top-N chunks ──────────
        const context = chunks
            .map((c: any) => c.content)
            .join("\n\n---\n\n");

        // ── 4. Call review engine multi-agent orchestrator ─────
        const result = await callMultiAgentReview(question, context);

        return res.status(200).json(
            new ApiResponse(200, result, "Multi-agent review complete")
        );
    }
);

export { MultiAgentReviewController };
