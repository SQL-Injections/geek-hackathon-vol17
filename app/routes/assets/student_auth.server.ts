import { redirect } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'
import { getStudentById, getStudentList } from '~/model'

const sessionSecret = process.env.STUDENT_SESSION_SECRET
if (!sessionSecret) {
    throw new Error('STUDENT_SESSION_SECRET must be set')
}

const cookieSessionStorage = createCookieSessionStorage({
    cookie: {
        name: 'student__session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
    },
})

export async function createUserSession(userId: string, classUuid: string, usrName: string, redirectPath: string) {
    const session = await cookieSessionStorage.getSession()
    session.set('usrId', userId)
    session.set('role', 'student')
    session.set('classUuid', classUuid)
    session.set('usrName', usrName)
    return redirect(redirectPath, {
        headers: {
            'Set-Cookie': await cookieSessionStorage.commitSession(session),
        },
    })
}

export async function requireUserSession(request: Request) {
    const data = await getUserFromSession(request)

    if (!data) {
        throw redirect('/login_students')
    }

    return data
}
export async function getUserFromSession(request: Request) {
    const session = await cookieSessionStorage.getSession(request.headers.get('Cookie'))

    const usrId: string = session.get('usrId')
    const classUuid: string = session.get('classUuid')
    const usrName: string = session.get('usrName')

    const student = await getStudentById(classUuid, usrId)
    if (!student) {
        return null
    }
    const usrUuid = student.uuid
    if (!usrId) {
        return null
    }

    return { usrId, usrName, usrUuid, classUuid }
}
