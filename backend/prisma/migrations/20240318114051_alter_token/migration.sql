/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Token` table. All the data in the column will be lost.
  - Added the required column `expirationTime` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Token` DROP COLUMN `createdAt`,
    ADD COLUMN `expirationTime` DATETIME(3) NOT NULL;
