-- CreateTable
CREATE TABLE "readings" (
    "id" SERIAL NOT NULL,
    "device_id" TEXT NOT NULL,
    "question" TEXT,
    "ring_position" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "readings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "readings_device_id_idx" ON "readings"("device_id");
