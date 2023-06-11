/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "AuthMethod" (
    "id" SERIAL NOT NULL,
    "google" BOOLEAN NOT NULL,
    "github" BOOLEAN NOT NULL,
    "credentials" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuthMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthMethod_userId_key" ON "AuthMethod"("userId");

-- AddForeignKey
ALTER TABLE "AuthMethod" ADD CONSTRAINT "AuthMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
