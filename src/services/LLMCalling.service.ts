const llmCallTogetHumanAns = async(questionForLLM: any, databaseContext: any) => {
    try{
            const response = await fetch(
                "http://review-engine:9000/llmcall/forans",
                {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: questionForLLM,
                        context: databaseContext
                    })
                }
            )
            console.log("===============================================================");
            console.log("Status:", response.status);
            const data = await response.json();
            console.log("Response:", data);
            if(!response.ok)
            {
                console.log("the data comming from llm call", data);
                console.log("response form llm", response.status);
                throw new Error(data.message || "Data is not present in question chunking" );
            }

            return data;

    } catch (error) {
        console.log("error in llm api call", error);
        const message = error instanceof Error ? error.message : "";
        console.log(message);
        throw error;
    }
}
export {
    llmCallTogetHumanAns
}
