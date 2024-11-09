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
