import { Student } from '~/model/model'

export type ClassStudents = {
    [classId: string]: Array<Student>
}
export const studentDat: ClassStudents = {
    '1': [{
        id: '1',
        displayName: '山田太郎'
    },{
        id: '2',
        displayName: '高専太郎'
    }]
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
export async function pushUsr(user: Array<Student>, classId: string) {
    studentDat[classId] = user
    return true
}
