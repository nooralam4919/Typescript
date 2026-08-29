import fs from "fs/promises";

export const Chunking = async (files: string[]) => {

    const allChunks = [];

    for (const file of files) {

        // Read the file
        const content = await fs.readFile(
            file,
            "utf-8"
        );

        // Send file content to Review Engine
        const response = await fetch(
            "http://review-engine:9000/RAG/process",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    filePath: file,
                    content: content
                })
            }
        );

        // Check response
        if (!response.ok) {
            const errorText = await response.text();
            console.log(
                "Review Engine Error:",
                response.status,
                errorText
            );

            throw new Error(
                `Review Engine failed: ${response.status}`
            );
        }

        // Convert response to JSON
        const result = await response.json();

        console.log(
            "Coming from Review Engine:",
            result
        );

        allChunks.push(result);
    }

    return allChunks;
};