-- CreateEnum
CREATE TYPE "public"."ClientCategory" AS ENUM ('STANDARD', 'PREMIUM');

-- CreateTable
CREATE TABLE "public"."client" (
    "id" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location" TEXT NOT NULL,
    "earnings" INTEGER NOT NULL,
    "serviceType" TEXT NOT NULL,
    "category" "public"."ClientCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);
