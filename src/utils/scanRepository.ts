import fs from "fs/promises";
import path from "path";

const ignoredFolders = [
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage"
];

const allowedExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".go",
    ".rs"
];

export const scanRepository = async ( directory: string ): Promise<string[]> => {
    const files: string[] = [];
    
    const entries = await fs.readdir(directory, {
        withFileTypes: true
    });

    for (const entry of entries) {

        const fullPath = path.join(
            directory,
            entry.name
        );

        if ( entry.isDirectory() && ignoredFolders.includes(entry.name)){
            continue;
        }

        if (entry.isDirectory()) {

            const nestedFiles = await scanRepository( fullPath );

            files.push(...nestedFiles);

        } else {

            const extension = path.extname(entry.name);

            if (allowedExtensions.includes(extension)) {
                files.push(fullPath);
            }
        }
    }

    return files;
};