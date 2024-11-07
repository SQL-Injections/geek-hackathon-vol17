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
export async function pushUsr(user: Array<Student>, classId: string) {
    studentDat[classId] = user
    return true
}

export const getStudentList = async (classId: string) => {
    return studentDat[classId]
}

// rename displayName
export async function reName(userId: string, classId: string,newName:string) {
    if (!userId || !classId) {
        return false
    }
    const studentList = studentDat[classId]
    studentList.map((student) => {
        if (student.id == userId) {
            student.displayName = newName;
            return true;
        }
    })
    return false;
}