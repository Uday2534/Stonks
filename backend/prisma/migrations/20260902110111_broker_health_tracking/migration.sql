-- CreateEnum
CREATE TYPE "BrokerType" AS ENUM ('ZERODHA', 'GROWW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrokerAccount" (
    "id" TEXT NOT NULL,
    "broker" "BrokerType" NOT NULL,
    "brokerUserId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiry" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "isConnected" BOOLEAN NOT NULL DEFAULT true,
    "lastSuccessfulSync" TIMESTAMP(3),
    "lastSyncError" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BrokerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioSnapshot" (
    "id" TEXT NOT NULL,
    "portfolioValue" DOUBLE PRECISION NOT NULL,
    "investedValue" DOUBLE PRECISION NOT NULL,
    "totalPnl" DOUBLE PRECISION NOT NULL,
    "dailyPnl" DOUBLE PRECISION NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brokerAccountId" TEXT NOT NULL,

    CONSTRAINT "PortfolioSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenchmarkSnapshot" (
    "id" TEXT NOT NULL,
    "benchmark" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BenchmarkSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "BrokerAccount_userId_idx" ON "BrokerAccount"("userId");

-- CreateIndex
CREATE INDEX "BrokerAccount_broker_brokerUserId_idx" ON "BrokerAccount"("broker", "brokerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "BrokerAccount_userId_broker_key" ON "BrokerAccount"("userId", "broker");

-- CreateIndex
CREATE INDEX "PortfolioSnapshot_brokerAccountId_idx" ON "PortfolioSnapshot"("brokerAccountId");

-- CreateIndex
CREATE INDEX "PortfolioSnapshot_snapshotDate_idx" ON "PortfolioSnapshot"("snapshotDate");

-- CreateIndex
CREATE INDEX "PortfolioSnapshot_brokerAccountId_snapshotDate_idx" ON "PortfolioSnapshot"("brokerAccountId", "snapshotDate");

-- CreateIndex
CREATE INDEX "BenchmarkSnapshot_benchmark_idx" ON "BenchmarkSnapshot"("benchmark");

-- CreateIndex
CREATE INDEX "BenchmarkSnapshot_snapshotDate_idx" ON "BenchmarkSnapshot"("snapshotDate");

-- CreateIndex
CREATE INDEX "BenchmarkSnapshot_benchmark_snapshotDate_idx" ON "BenchmarkSnapshot"("benchmark", "snapshotDate");

-- AddForeignKey
ALTER TABLE "BrokerAccount" ADD CONSTRAINT "BrokerAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioSnapshot" ADD CONSTRAINT "PortfolioSnapshot_brokerAccountId_fkey" FOREIGN KEY ("brokerAccountId") REFERENCES "BrokerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
