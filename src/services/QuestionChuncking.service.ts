const questionChucking = async (userQuestion: string) => {
    try {
        const response = await fetch(
            "http://review-engine:9000/questionchunk/analyze-question", // actually is not chuncking its embedding
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: userQuestion,
                }),
            }
        );

        const data = await response.json();

        console.log("Question chunking response:", data);

        if (!response.ok) {
            console.log( "Problem in question chunking:", data );

            console.log( "Status:", response.status );

            throw new Error( data.message || "Data is not present in question chunking" );
        }

        return data;

    } catch (error: any) {
        console.error(
            "Question chunking has a problem:",
            error
        );

        throw error;
    }
};

export {
    questionChucking
};