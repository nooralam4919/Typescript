export const EmbeddingService = async (chunks: string[]) => {
    const arrEmbedding = [];

    for (const chunk of chunks) {
        const response = await fetch(
            "http://review-engine:9000/RAG/embedding",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: chunk,
                }),
            }
        );

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

        const data = await response.json();

        console.log("data after embedding:", data);

        if (!data.embedding) {
            throw new Error(
                "Embedding is missing from Review Engine response"
            );
        }

        arrEmbedding.push(data.embedding);
    }

    return arrEmbedding;
};