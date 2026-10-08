export const RepositoryService = async (githubAccessToken: string) => {
    const repoApiCall = await fetch(
        "https://api.github.com/user/repos?per_page=100&sort=updated&direction=desc",
        {
            headers: {
                Authorization: `Bearer ${githubAccessToken}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    if (!repoApiCall.ok) {
        const errorText = await repoApiCall.text();
        console.error("GitHub API error:", repoApiCall.status, errorText);
        throw new Error(`GitHub API failed: ${repoApiCall.status}`);
    }

    const repositories = await repoApiCall.json();
    return repositories;
};
