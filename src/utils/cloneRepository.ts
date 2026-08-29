import { simpleGit } from "simple-git";
import path from "path";
import fs from "fs/promises";

export async function cloneRepository(cloneUrl: string) {
    const repoId = Date.now().toString();

    const repoPath = path.join(
        process.cwd(),
        "repositories",
        repoId
    );

    await fs.mkdir(repoPath, {
        recursive: true,
    });

    const git = simpleGit();

    await git.clone(cloneUrl, repoPath);

    console.log("Repository cloned at:", repoPath);

    return repoPath;
}