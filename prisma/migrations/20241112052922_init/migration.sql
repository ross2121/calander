/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `form` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "form_date_key" ON "form"("date");
