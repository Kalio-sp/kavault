-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('ARTICLE', 'DOCUMENTATION', 'WEBSITE', 'REPOSITORY', 'VIDEO');

-- CreateEnum
CREATE TYPE "LearningStatus" AS ENUM ('TO_LEARN', 'LEARNING', 'COMPLETED');

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "type" "ResourceType" NOT NULL DEFAULT 'ARTICLE',
    "status" "LearningStatus" NOT NULL DEFAULT 'TO_LEARN',
    "tags" TEXT[],
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
