-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(12) NOT NULL,
    "name" VARCHAR(8) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(12) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "JAN" BIGINT NOT NULL,
    "code" CHAR(5) NOT NULL,
    "branch" CHAR(4) NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "MFD" TIMESTAMP(3) NOT NULL,
    "BBE" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "number" SMALLINT NOT NULL,
    "QTY" SMALLINT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "_LocationToProduct" (
    "A" SMALLINT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToProduct_AB_unique" ON "_LocationToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToProduct_B_index" ON "_LocationToProduct"("B");

-- AddForeignKey
ALTER TABLE "_LocationToProduct" ADD CONSTRAINT "_LocationToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToProduct" ADD CONSTRAINT "_LocationToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
