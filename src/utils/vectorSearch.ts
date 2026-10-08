import prisma from "../lib/prisma.js";

type VectorSearchResult = {
    id: string;
    content: string;
    distance: number;
};

// If projectId is supplied, search only within that project's chunks.
// This prevents answers bleeding across different scanned repositories.
export const vectorSearch = async (
    queryVector: number[],
    limit: number = 5,
    projectId?: string
) => {
    const vector = `[${queryVector.join(",")}]`;

    if (projectId) {
        const results = await prisma.$queryRaw<VectorSearchResult[]>`
            SELECT
                id,
                content,
                embedding <=> ${vector}::vector AS distance
            FROM "CodeChunk"
            WHERE embedding IS NOT NULL
              AND "projectId" = ${projectId}
            ORDER BY embedding <=> ${vector}::vector
            LIMIT ${limit};
        `;
        return results;
    }

    // Fallback: search all chunks (used when no project is selected)
    const results = await prisma.$queryRaw<VectorSearchResult[]>`
        SELECT
            id,
            content,
            embedding <=> ${vector}::vector AS distance
        FROM "CodeChunk"
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> ${vector}::vector
        LIMIT ${limit};
    `;
    return results;
};
