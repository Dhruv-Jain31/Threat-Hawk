/*
  Warnings:

  - You are about to drop the column `resultHtml` on the `Scan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scan" DROP COLUMN "resultHtml",
ADD COLUMN     "scanResult" JSONB;
