-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('VOCABULARY', 'KANJI', 'GRAMMAR', 'KANA');

-- CreateTable
CREATE TABLE "JapaneseCard" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "reading" TEXT,
    "meaning" TEXT NOT NULL,
    "example" TEXT,
    "type" "CardType" NOT NULL DEFAULT 'VOCABULARY',
    "level" INTEGER NOT NULL DEFAULT 0,
    "nextReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "JapaneseCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JapaneseCard" ADD CONSTRAINT "JapaneseCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
