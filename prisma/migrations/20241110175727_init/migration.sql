-- CreateTable
CREATE TABLE "form" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "text" TEXT,
    "picture" TEXT,
    "video" TEXT,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);
