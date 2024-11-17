import { redirect } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'

const sessionSecret = process.env.ADMIN_SESSION_SECRET
if (!sessionSecret) {
    throw new Error('ADMIN_SESSION_SECRET must be set')
}

const cookieSessionStorage = createCookieSessionStorage({
    cookie: {
        name: 'admin__session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
    },
})

export async function createUserSession(userId: string, userUuid: string, redirectPath: string) {
    const session = await cookieSessionStorage.getSession()
    session.set('usrId', userId)
    session.set('usrUuid', userUuid)
    session.set('role', 'admin')
    return redirect(redirectPath, {
        headers: {
            'Set-Cookie': await cookieSessionStorage.commitSession(session),
        },
    })
}

export async function requireUserSession(request: Request) {
    const data = await getUserFromSession(request)

    if (!data) {
        throw redirect('/admin_login')
    }

    return data
}
export async function getUserFromSession(request: Request) {
    const session = await cookieSessionStorage.getSession(request.headers.get('Cookie'))

    const usrId: string = session.get('usrId')
    const usrUuid: string = session.get('usrUuid')

    if (!usrId) {
        return null
    }

    return { usrId, usrUuid }
}

export async function logoutUser(request: Request) {
    const session = await cookieSessionStorage.getSession(request.headers.get('Cookie'))
    return redirect('/admin_login', {
        headers: {
            'Set-Cookie': await cookieSessionStorage.destroySession(session),
        },
    })
}
