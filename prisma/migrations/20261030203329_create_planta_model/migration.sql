-- CreateEnum
CREATE TYPE "Luminosidade" AS ENUM ('SOMBRA', 'MEIA_SOMBRA', 'SOL_PLENO');

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "preco" INTEGER NOT NULL,
    "estoque" INTEGER NOT NULL,
    "luminosidade" "Luminosidade" NOT NULL,
    "petFriendly" BOOLEAN NOT NULL,
    "regaACadaDias" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plant_especie_key" ON "Plant"("especie");
