-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('EMAIL', 'TELEGRAM', 'BOTH');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deliveryChannel" "DeliveryChannel" NOT NULL DEFAULT 'EMAIL',
ADD COLUMN "telegramChatId" TEXT,
ADD COLUMN "telegramLinkExpires" TIMESTAMP(3),
ADD COLUMN "telegramLinkToken" TEXT,
ADD COLUMN "unsubscribedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramChatId_key" ON "User"("telegramChatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramLinkToken_key" ON "User"("telegramLinkToken");
