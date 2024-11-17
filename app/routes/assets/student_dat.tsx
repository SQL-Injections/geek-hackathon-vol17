import { Student } from '~/model/model'
import { createStudent, createStudents, getStudentList as getStudents, getStudentById as getStudentByI } from '~/model'

// 複数の学生を追加する関数
export async function pushUsr(users: Array<Student>, classUuid: string) {
    await createStudents(classUuid, users)
    return true
}

// 指定されたクラスIDの学生リストを取得する関数
export async function getStudentList(classUuid: string): Promise<Array<Student>> {
    return getStudents(classUuid)
}

export async function getStudentById(classUuid: string, studentId: string) {
    return getStudentByI(classUuid, studentId)
}

// rename displayName
export async function reName(userId: string, classId: string, newName: string) {
    if (!userId || !classId) {
        return false
    }
    // const studentList = studentDat[classId]
    // studentList.map((student) => {
    //     if (student.id == userId) {
    //         student.displayName = newName;
    //         return true;
    //     }
    // })
    return false
}
