-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('WELCOME_BONUS', 'PURCHASE', 'RIP_SPEND', 'PERFECT_CUT_SPEND', 'SELL_BACK', 'ADMIN_GRANT', 'ADMIN_ADJUST');

-- CreateEnum
CREATE TYPE "VaultStatus" AS ENUM ('VAULTED', 'SHIP_REQUESTED', 'SHIPPED', 'SOLD');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('REQUESTED', 'LABEL_CREATED', 'SHIPPED', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "CutTier" AS ENUM ('ELITE', 'PREMIUM', 'STANDARD');

-- CreateEnum
CREATE TYPE "CutStatus" AS ENUM ('PENDING', 'RESOLVED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "tokenBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TxType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "stripeSessionId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaultItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,
    "serial" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "status" "VaultStatus" NOT NULL DEFAULT 'VAULTED',
    "showcased" BOOLEAN NOT NULL DEFAULT false,
    "pulledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VaultItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PullEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "cardIds" TEXT[],
    "grades" DOUBLE PRECISION[],
    "cost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PullEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfectCutRound" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "trueLine" JSONB NOT NULL,
    "userLine" JSONB,
    "precision" DOUBLE PRECISION,
    "tier" "CutTier",
    "cardId" TEXT,
    "grade" DOUBLE PRECISION,
    "status" "CutStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "PerfectCutRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vaultItemId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'REQUESTED',
    "recipientName" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "TokenTransaction_userId_createdAt_idx" ON "TokenTransaction"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VaultItem_serial_key" ON "VaultItem"("serial");

-- CreateIndex
CREATE INDEX "VaultItem_userId_pulledAt_idx" ON "VaultItem"("userId", "pulledAt");

-- CreateIndex
CREATE INDEX "PullEvent_userId_createdAt_idx" ON "PullEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PerfectCutRound_userId_createdAt_idx" ON "PerfectCutRound"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_vaultItemId_key" ON "Order"("vaultItemId");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultItem" ADD CONSTRAINT "VaultItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PullEvent" ADD CONSTRAINT "PullEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfectCutRound" ADD CONSTRAINT "PerfectCutRound_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vaultItemId_fkey" FOREIGN KEY ("vaultItemId") REFERENCES "VaultItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
