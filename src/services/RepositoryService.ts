

export const RepositoryService = async (githubAccessToken: string) => {
    const repoApiCall = await fetch(
        "https://api.github.com/user/repos",
        {
            headers: {
                Authorization: `Bearer ${githubAccessToken}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    const repositories = await repoApiCall.json();

    return repositories;
};
