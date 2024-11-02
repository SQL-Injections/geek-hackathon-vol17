import { Student } from '~/model/model'

export type ClassStudents = {
    [classId: string]: Array<Student>
}
const studentDat: ClassStudents = {
    '1': [
        {
            id: '1',
            displayName: '山田太郎',
        },
    ],
}

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

export const getStudentList = async (classId: string) => {
    return studentDat[classId]
}
