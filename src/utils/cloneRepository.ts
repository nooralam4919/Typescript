import { simpleGit } from "simple-git";
import path from "path";
import fs from "fs/promises";
import os from "os";

export async function cloneRepository(cloneUrl: string) {
    const repoId = Date.now().toString();

    // Use OS temp dir — outside the Docker bind mount.
    // This prevents /app volume from filling up with cloned repos.
    const repoPath = path.join(os.tmpdir(), "codesentinel", repoId);

    await fs.mkdir(repoPath, { recursive: true });

    const git = simpleGit();

    // Shallow clone: only the latest commit, no history, no tags.
    // Reduces clone size by 80–95% for large repos.
    await git.clone(cloneUrl, repoPath, [
        "--depth", "1",
        "--single-branch",
        "--no-tags",
    ]);

    console.log("Repository cloned at:", repoPath);
    return repoPath;
}
