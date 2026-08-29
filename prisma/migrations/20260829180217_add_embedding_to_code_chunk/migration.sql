CREATE EXTENSION IF NOT EXISTS vector;
-- CreateTable
CREATE TABLE "ScanFile" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "language" TEXT,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeChunk" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "scanFileId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "startLine" INTEGER,
    "endLine" INTEGER,
    "language" TEXT,
    "metadata" JSONB,
    "embedding" vector(3072),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScanFile_scanId_idx" ON "ScanFile"("scanId");

-- CreateIndex
CREATE INDEX "ScanFile_projectId_idx" ON "ScanFile"("projectId");

-- CreateIndex
CREATE INDEX "ScanFile_filePath_idx" ON "ScanFile"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "ScanFile_scanId_filePath_key" ON "ScanFile"("scanId", "filePath");

-- CreateIndex
CREATE INDEX "CodeChunk_scanId_idx" ON "CodeChunk"("scanId");

-- CreateIndex
CREATE INDEX "CodeChunk_projectId_idx" ON "CodeChunk"("projectId");

-- CreateIndex
CREATE INDEX "CodeChunk_scanFileId_idx" ON "CodeChunk"("scanFileId");

-- CreateIndex
CREATE UNIQUE INDEX "CodeChunk_scanFileId_chunkIndex_key" ON "CodeChunk"("scanFileId", "chunkIndex");

-- AddForeignKey
ALTER TABLE "ScanFile" ADD CONSTRAINT "ScanFile_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanFile" ADD CONSTRAINT "ScanFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeChunk" ADD CONSTRAINT "CodeChunk_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeChunk" ADD CONSTRAINT "CodeChunk_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeChunk" ADD CONSTRAINT "CodeChunk_scanFileId_fkey" FOREIGN KEY ("scanFileId") REFERENCES "ScanFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
