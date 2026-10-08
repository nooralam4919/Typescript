import fs from "fs/promises";

export const Chunking = async (files: string[]) => {

    const allChunks = [];

    for (const file of files) {

        // Read the file content
        const content = await fs.readFile(file, "utf-8");

        // Skip empty files — the review engine rejects empty content
        if (!content || content.trim().length === 0) {
            console.log("Skipping empty file:", file);
            continue;
        }

        // Send file content to Review Engine for chunking
        const response = await fetch(
            "http://review-engine:9000/RAG/process",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filePath: file, content }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Review Engine Error:", response.status, errorText);
            throw new Error(`Review Engine failed: ${response.status}`);
        }

        const result = await response.json();
        allChunks.push(result);
    }

    return allChunks;
};
