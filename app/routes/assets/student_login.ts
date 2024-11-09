import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { createUserSession } from './student_auth.server'
import { getStudentById, isValidStudent, updateStudent } from '~/model/student.server'
import { getClassById } from './class_dat'

export async function login({ class_id, usr_id, usr_name }: { class_id: string; usr_id: string; usr_name: string }) {
    const cls = await getClassById(class_id)
    if (!cls) {
        return
    }
    const classUuid = cls.uuid
    const existingUser = await getStudentById(classUuid, usr_id)
    if (!existingUser) {
        const error: any = new Error('id又はpasswordに誤りがあります。')
        error.status = 401
        throw error
    }
    await updateStudent({ ...existingUser, displayName: usr_name })

    return createUserSession(usr_id, classUuid, usr_name, '/write_my_seats')
}
