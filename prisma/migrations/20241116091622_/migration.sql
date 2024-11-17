/*
  Warnings:

  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Manager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "managerUuid" TEXT NOT NULL,
    CONSTRAINT "Class_managerUuid_fkey" FOREIGN KEY ("managerUuid") REFERENCES "Manager" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("id", "managerUuid", "name", "uuid") SELECT "id", "managerUuid", "name", "uuid" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE UNIQUE INDEX "Class_uuid_key" ON "Class"("uuid");
CREATE TABLE "new_Manager" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Manager" ("id", "password", "uuid") SELECT "id", "password", "uuid" FROM "Manager";
DROP TABLE "Manager";
ALTER TABLE "new_Manager" RENAME TO "Manager";
CREATE UNIQUE INDEX "Manager_uuid_key" ON "Manager"("uuid");
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "classUuid" TEXT NOT NULL,
    CONSTRAINT "Student_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("classUuid", "displayName", "id", "uuid") SELECT "classUuid", "displayName", "id", "uuid" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_uuid_key" ON "Student"("uuid");
CREATE TABLE "new__SeatStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SeatStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Seat" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SeatStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__SeatStudents" ("A", "B") SELECT "A", "B" FROM "_SeatStudents";
DROP TABLE "_SeatStudents";
ALTER TABLE "new__SeatStudents" RENAME TO "_SeatStudents";
CREATE UNIQUE INDEX "_SeatStudents_AB_unique" ON "_SeatStudents"("A", "B");
CREATE INDEX "_SeatStudents_B_index" ON "_SeatStudents"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
