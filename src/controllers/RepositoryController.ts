import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandle.js";
import { Request, Response } from "express";
import { cloneRepository } from "../utils/cloneRepository.js";
import { scanRepository } from "../utils/scanRepository.js";
import { Chunking } from "../services/Chunking.service.js";
import { EmbeddingService } from "../services/Embedding.service.js";
import prisma from "../lib/prisma.js";

const RepoRequest = asyncHandler(
    async (req: Request, res: Response) => {

        const { cloneUrl } = req.body;
        const userId = req.userId;

        if (!cloneUrl) {
            throw new ApiError(400, "cloneUrl is not found");
        }

        if (!userId) {
            throw new ApiError(400, "user is not found");
        }

        console.log("Repository URL:", cloneUrl);

        // 1. Clone repository
        const repoPath = await cloneRepository(cloneUrl);

        console.log(
            "This is my repo clone:",
            repoPath
        );

        // 2. Scan repository
        const scanRepo = await scanRepository(repoPath);

        console.log(
            "Number of files:",
            scanRepo.length
        );

        console.log(scanRepo);

        // 3. Chunk documents
        const chunkingAPItoRevieEngi = await Chunking(scanRepo);

        console.log(
            "Chunking response:",
            chunkingAPItoRevieEngi
        );

        // 4. Extract chunks
        const allChunks = chunkingAPItoRevieEngi.flatMap(
                (file) => file.chunks
            );

        // console.log( "All chunks:", allChunks );


        // console.log("========== EMBEDDING DEBUG ==========");
        // console.log("Number of chunks:", allChunks.length);
        // console.log("First chunk:", allChunks[0]);
        // console.log("First chunk type:", typeof allChunks[0]);
        // console.log("Is first chunk array:", Array.isArray(allChunks[0]));
        // console.log("====================================");

        // 5. Generate embeddings
        const embedding = await EmbeddingService(allChunks);

        // console.log("========== EMBEDDING RESULT ==========");
        // console.log("Embedding result:", embedding);
        // console.log("Embedding result type:", typeof embedding);
        // console.log("Is array:", Array.isArray(embedding));
        // console.log("Number of embeddings:", embedding?.length);

        // if (Array.isArray(embedding) && embedding.length > 0) {
        //     console.log("First embedding:", embedding[0]);
        //     console.log("First embedding type:", typeof embedding[0]);
        //     console.log(
        //         "First embedding is array:",
        //         Array.isArray(embedding[0])
        //     );
        //     console.log(
        //         "First embedding length:",
        //         Array.isArray(embedding[0])
        //             ? embedding[0].length
        //             : "N/A"
        //     );
        // }

        // console.log("======================================");

        // console.log(
        //     "Embedding has been done successfully!",
        //     embedding
        // );


        // console.log("thi is my user ID" , userId)

        const findUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!findUser)
            throw new ApiError(400, "use is not found");

        // pushing into database
        //Think about it as:
        // Who owns this repository? → Which repository? → Which scan? → Which files? → Which chunks? → Which security findings?

        // 6. Send response
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    cloneUrl,
                    repoPath,
                    userId,
                    filesProcessed: scanRepo.length,
                    chunksProcessed: allChunks.length
                },
                "Successfully processed repository"
            )
        );
    }
);

export {
    RepoRequest
};