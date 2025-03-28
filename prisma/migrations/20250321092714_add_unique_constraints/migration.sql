/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_id_userId_key" ON "Category"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_id_userId_key" ON "Task"("id", "userId");
