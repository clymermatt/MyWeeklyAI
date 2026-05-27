-- CreateEnum
CREATE TYPE "RiskTier" AS ENUM ('LOW', 'MODERATE', 'MODERATE_HIGH', 'HIGH', 'SEVERE');

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "userId" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 1,
    "roleAssessed" TEXT NOT NULL,
    "industryAssessed" TEXT NOT NULL,
    "seniorityLevel" TEXT NOT NULL,
    "yearsExperience" TEXT NOT NULL,
    "responses" JSONB NOT NULL,
    "compositeScore" INTEGER NOT NULL,
    "tier" "RiskTier" NOT NULL,
    "taskAutomatability" INTEGER NOT NULL,
    "adoptionVelocity" INTEGER NOT NULL,
    "skillDifferentiationRaw" INTEGER NOT NULL,
    "careerPortabilityRaw" INTEGER NOT NULL,
    "timeToImpactUrgency" INTEGER NOT NULL,
    "selectedPivotPaths" JSONB NOT NULL,
    "reportContent" JSONB,
    "pdfUrl" TEXT,
    "completionTimeSeconds" INTEGER,
    "referrerUrl" TEXT,
    "retakenFromId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentBenchmark" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "seniorityLevel" TEXT NOT NULL,
    "compositeScore" INTEGER NOT NULL,
    "taskAutomatability" INTEGER NOT NULL,
    "adoptionVelocity" INTEGER NOT NULL,
    "skillDifferentiationRaw" INTEGER NOT NULL,
    "careerPortabilityRaw" INTEGER NOT NULL,
    "timeToImpactUrgency" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_resultId_key" ON "AssessmentResult"("resultId");

-- CreateIndex
CREATE INDEX "AssessmentResult_userId_createdAt_idx" ON "AssessmentResult"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AssessmentResult_roleAssessed_createdAt_idx" ON "AssessmentResult"("roleAssessed", "createdAt");

-- CreateIndex
CREATE INDEX "AssessmentBenchmark_role_createdAt_idx" ON "AssessmentBenchmark"("role", "createdAt");

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_retakenFromId_fkey" FOREIGN KEY ("retakenFromId") REFERENCES "AssessmentResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;
