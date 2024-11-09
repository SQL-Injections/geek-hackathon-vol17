-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "classUuid" TEXT NOT NULL,
    CONSTRAINT "Student_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "managerUuid" TEXT NOT NULL,
    CONSTRAINT "Class_managerUuid_fkey" FOREIGN KEY ("managerUuid") REFERENCES "Manager" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Room" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "seatAmount" INTEGER NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "classUuid" TEXT NOT NULL,
    CONSTRAINT "Room_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Seat" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "roomUuid" TEXT NOT NULL,
    CONSTRAINT "Seat_roomUuid_fkey" FOREIGN KEY ("roomUuid") REFERENCES "Room" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SeatStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SeatStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Seat" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SeatStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_uuid_key" ON "Manager"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Student_uuid_key" ON "Student"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Class_uuid_key" ON "Class"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "_SeatStudents_AB_unique" ON "_SeatStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_SeatStudents_B_index" ON "_SeatStudents"("B");
