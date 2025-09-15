-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "galleryImages" TEXT[],
ADD COLUMN     "membershipType" TEXT NOT NULL DEFAULT 'inactive';
