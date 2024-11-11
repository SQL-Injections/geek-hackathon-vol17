import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { createUserSession } from './admin_auth.server'
import { getAdmin, isValidAdmin } from '~/model/admin.server'

export async function login({ usr_id, password }: { usr_id: string; password: string }) {
    const UserObj = { id: usr_id, password: password }
    const existingUser = await isValidAdmin(UserObj)
    if (!existingUser) {
        const error: any = new Error('管理者用idかパスワードが間違っています')
        error.status = 401
        throw error
    }

    const adminInfo = await getAdmin(usr_id)
    if (!adminInfo) {
        const error: any = new Error('サーバーにエラーが起きました。管理者に問い合わせてください。')
        error.status = 500
        throw error
    }
    const adminUuid = adminInfo.uuid
    return createUserSession(usr_id, adminUuid, '/management_classes')
}
