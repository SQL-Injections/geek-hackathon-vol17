import { prisma } from './db.server'
import { Student } from './model'

export async function getStudentList(classUuid: string) {
    return prisma.student.findMany({
        where: {
            classUuid: classUuid,
        },
    })
}

export async function getStudent(classUuid: string, studentUuid: string) {
    return prisma.student.findFirst({
        where: {
            uuid: studentUuid,
        },
    })
}

export async function getStudentById(classUuid: string, studentId: string) {
    return prisma.student.findFirst({
        where: {
            id: studentId,
            classUuid: classUuid,
        },
    })
}

export async function createStudent(classUuid: string, student: Student) {
    return prisma.student.create({
        data: {
            ...student,
            classUuid: classUuid,
        },
    })
}

export async function createStudents(classUuid: string, students: Array<Student>) {
    console.log(students)
    console.log(classUuid)
    return prisma.student.createMany({
        data: students.map((student) => ({
            ...student,
            classUuid: classUuid,
        })),
    })
}

export async function updateStudent(student: Student) {
    return prisma.student.update({
        where: {
            uuid: student.uuid,
        },
        data: student,
    })
}

export async function updateStudents(classUuid: string, students: Array<Student>) {
    return prisma.student.updateMany({
        where: {
            classUuid: classUuid,
        },
        data: students.map((student) => ({
            ...student,
        })),
    })
}

export async function isValidStudent(userId: string, classId: string) {
    const student = await prisma.student.findFirst({
        where: {
            id: userId,
            classUuid: classId,
        },
    })
    if (student) {
        return true
    } else {
        return false
    }
}
