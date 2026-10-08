export async function askReviewEngineService(question: string) {
    console.log("🔥 1. Calling Review Engine");

    const response = await fetch(
        "http://review-engine:9000/agent/query",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: question,
            }),
        }
    );

    console.log("🔥 2. Review Engine responded, status:", response.status);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Review engine call failed");
    }

    console.log("🔥 3. Data received from Review Engine");

    return data;
}
