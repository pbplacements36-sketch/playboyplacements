/*
  Warnings:

  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;
