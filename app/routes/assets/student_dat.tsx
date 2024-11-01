import { Student } from '~/model/model'

export type ClassStudents = {
    [classId: string]: Array<Student>
}
const studentDat: ClassStudents = {}

export async function isValidUsr(userId: string, classId: string) {
    const studentList = studentDat[classId]
    console.log(userId, classId)
    if (!userId || !classId) {
        return false
    }

    return studentList.some((student) => student.id === userId)
}

// createStudent
export async function pushUsr(user: Student, classId: string) {
    if (!user.id || !classId) {
        return false
    }

    studentDat[classId] = [...studentDat[classId], user]
    return true
}
