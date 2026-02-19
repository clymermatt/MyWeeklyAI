-- CreateEnum
CREATE TYPE "SourceCategory" AS ENUM ('INDUSTRY_NEWS', 'AI_LAB', 'RESEARCH_ANALYSIS');

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "category" "SourceCategory" NOT NULL DEFAULT 'INDUSTRY_NEWS';
