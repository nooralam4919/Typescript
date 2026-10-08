// Calls the review engine's multi-agent orchestrator.
// The review engine handles: planner routing → specialist agents → synthesizer.
export async function callMultiAgentReview(
    question: string,
    context: string
): Promise<{
    answer:        string;
    agentsUsed:    string[];
    plannerMode:   string;
    plannerReason: string;
    severity:      Record<string, any>;
}> {
    const response = await fetch(
        "http://review-engine:9000/multiagent/review",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, context }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Multi-agent review failed");
    }

    return data;
}
