import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandle.js";
import { Request, Response } from "express";
import { cloneRepository } from "../utils/cloneRepository.js";
import { scanRepository } from "../utils/scanRepository.js";
import { Chunking } from "../services/Chunking.service.js";
import { EmbeddingService } from "../services/Embedding.service.js";
import prisma from "../lib/prisma.js";
import fs from "fs";
import path from "path";

const detectLanguage = (filePath: string): string => {
    const ext = path.extname(filePath).toLowerCase();

    const map: Record<string, string> = {
        ".ts": "TypeScript",
        ".tsx": "TypeScript",
        ".js": "JavaScript",
        ".jsx": "JavaScript",
        ".py": "Python",
        ".java": "Java",
        ".go": "Go",
        ".rs": "Rust",
        ".cpp": "C++",
        ".c": "C",
        ".h": "C",
        ".rb": "Ruby",
        ".php": "PHP",
        ".swift": "Swift",
        ".kt": "Kotlin",
    };

    return map[ext] ?? "Unknown";
};

const RepoRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const { cloneUrl } = req.body;
        const userId = req.userId;

        if (!cloneUrl) {
            throw new ApiError(400, "cloneUrl is required");
        }

        if (!userId) {
            throw new ApiError(401, "User is not authenticated");
        }

        const repositoryName = cloneUrl
                .split("/")
                .pop()
                ?.replace(/\.git$/, "") ?? "unnamed-project";

        // ── 1. Check if repository already exists ────────────────
        const existingProject = await prisma.project.findFirst({
            where: {
                ownerId: userId,
                repositoryUrl: cloneUrl,
            },
            include: {
                scans: {
                    where: {
                        status: "COMPLETED",
                    },
                    take: 1,
                },
            },
        });

        // ── 2. Return cached result if already scanned ──────────
        if (existingProject && existingProject.scans.length > 0) {
            console.log(
                "Repository already scanned — returning cached result"
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        projectId: existingProject.id,
                        scanId: existingProject.scans[0].id,
                        repositoryName,
                        repositoryUrl: cloneUrl,
                        cached: true,
                    },
                    "Repository already scanned — using existing data"
                )
            );
        }

        // ── 3. Create project only if it does not exist ─────────
        let projectId: string;

        if (existingProject) {
            projectId = existingProject.id;

            console.log(
                "Project already exists. Reusing project:",
                projectId
            );
        } else {
            const createdProject = await prisma.project.create({
                data: {
                    name: repositoryName,
                    repositoryUrl: cloneUrl,
                    repositoryName,
                    ownerId: userId,
                },
            });

            projectId = createdProject.id;

            console.log("Project created:", projectId);
        }

        // ── 4. Create scan ───────────────────────────────────────
        const scan = await prisma.scan.create({
            data: {
                projectId,
                userId,
                type: "MANUAL",
                status: "RUNNING",
            },
        });

        console.log("Scan created:", scan.id);

        // Declared outside try so finally can always clean up
        let repoPath: string | null = null;

        try {
            // ── 5. Clone repository ──────────────────────────────
            console.log("Cloning repository...");

            repoPath = await cloneRepository(cloneUrl);

            console.log("Cloned to:", repoPath);

            // ── 6. Scan files ────────────────────────────────────
            const scanRepo = await scanRepository(repoPath);

            console.log("Files found:", scanRepo.length);

            // ── 7. Chunk files ───────────────────────────────────
            const chunkingResult = await Chunking(scanRepo);

            // ── 8. Flatten chunks with source paths ──────────────
            const allChunks: string[] = [];
            const chunkFilePaths: string[] = [];

            for (let i = 0; i < chunkingResult.length; i++) {
                const fileChunks: string[] =
                    chunkingResult[i]?.chunks ?? [];

                for (const chunk of fileChunks) {
                    allChunks.push(chunk);
                    chunkFilePaths.push(scanRepo[i]);
                }
            }

            console.log("Total chunks:", allChunks.length);

            // ── 9. Generate embeddings ───────────────────────────
            const embeddings = await EmbeddingService(allChunks);

            if (embeddings.length !== allChunks.length) {
                throw new ApiError(
                    500,
                    `Embedding mismatch: ${allChunks.length} chunks vs ${embeddings.length} embeddings`
                );
            }

            console.log("Embeddings generated:", embeddings.length);

            // ── 10. Group chunks by file ─────────────────────────
            const fileChunkMap = new Map<
                string,
                {
                    chunks: string[];
                    embeddings: number[][];
                }
            >();

            for (let i = 0; i < allChunks.length; i++) {
                const filePath = chunkFilePaths[i];

                if (!fileChunkMap.has(filePath)) {
                    fileChunkMap.set(filePath, {
                        chunks: [],
                        embeddings: [],
                    });
                }

                fileChunkMap.get(filePath)!.chunks.push(allChunks[i]);
                fileChunkMap
                    .get(filePath)!
                    .embeddings.push(embeddings[i]);
            }

            // ── 11. Save ScanFile + CodeChunk records ───────────
            for (const [
                filePath,
                { chunks, embeddings: fileEmbeddings },
            ] of fileChunkMap) {
                const scanFile = await prisma.scanFile.create({
                    data: {
                        scanId: scan.id,
                        projectId,
                        filePath,
                        language: detectLanguage(filePath),
                        fileSize: 0,
                    },
                });

                for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
                    const vectorString = `[${fileEmbeddings[chunkIndex].join(",")}]`;

                    await prisma.$executeRaw`
                        INSERT INTO "CodeChunk" (
                            id,
                            "scanId",
                            "projectId",
                            "scanFileId",
                            "chunkIndex",
                            content,
                            embedding,
                            "createdAt"
                        )
                        VALUES (
                            gen_random_uuid(),
                            ${scan.id},
                            ${projectId},
                            ${scanFile.id},
                            ${chunkIndex},
                            ${chunks[chunkIndex]},
                            ${vectorString}::vector,
                            NOW()
                        )
                    `;
                }
            }

            // ── 12. Mark scan as completed ──────────────────────
            await prisma.scan.update({
                where: {
                    id: scan.id,
                },
                data: {
                    status: "COMPLETED",
                    completedAt: new Date(),
                    totalFiles: scanRepo.length,
                    scannedFiles: scanRepo.length,
                },
            });

            console.log("Repository scan complete.");

            // ── 13. Return success ──────────────────────────────
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        projectId,
                        scanId: scan.id,
                        repositoryName,
                        repositoryUrl: cloneUrl,
                        filesProcessed: scanRepo.length,
                        chunksProcessed: allChunks.length,
                        embeddingsStored: embeddings.length,
                        cached: false,
                    },
                    "Successfully processed repository"
                )
            );
        } catch (error: unknown) {
            // ── 14. Mark scan as failed ─────────────────────────
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error";

            await prisma.scan
                .update({
                    where: {
                        id: scan.id,
                    },
                    data: {
                        status: "FAILED",
                        errorMessage,
                    },
                })
                .catch(() => {});

            throw error;
        } finally {
            // ── 15. Always delete cloned repository ─────────────
            if (repoPath) {
                try {
                    fs.rmSync(repoPath, {
                        recursive: true,
                        force: true,
                    });

                    console.log(
                        "Cloned repo cleaned up:",
                        repoPath
                    );
                } catch {
                    console.warn(
                        "Could not clean up cloned repo:",
                        repoPath
                    );
                }
            }
        }
    }
);

export { RepoRequest };
