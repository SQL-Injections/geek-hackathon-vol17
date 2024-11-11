import { json } from '@remix-run/node'
import { pushUsr, addClass } from './assets/admin_dat'
import { requireUserSession } from './assets/admin_auth.server'
import { Class } from '~/model/model'
import { isValidAdmin } from '~/model/admin.server'

export async function loader({ request }: any) {
    const url = new URL(request.url)
    const usrId = url.searchParams.get('usr_id')?.toString() || ''
    //いったんハッシュ化もソルトも存在しない状態で使うものとする
    const password = url.searchParams.get('password')?.toString() || ''

    const UserObj = { id: usrId, password: password }
    return json({ isValid: await isValidAdmin(UserObj) })
}

export async function action({ request }: any) {
    const formData = await request.formData()
    const usrId = formData.get('usr_id')?.toString()
    const classId = formData.get('class_id')?.toString()
    const password = formData.get('password')?.toString()
    //className 追加
    const className = formData.get('class_name')?.toString()
    const func = formData.get('function')

    if (func === 'pushUsr') {
        const UserObj = { id: usrId, password: password }
        return json({ pushUsr: await pushUsr(UserObj) })
    }
    const query = await requireUserSession(request)
    if (!query) {
        return json({ FoundSession: false })
    }

    if (func === 'addClass') {
        const adminUuid = formData.get('admin_uuid')?.toString()
        const newClass = {
            id: formData.get('class_id')?.toString(),
            name: formData.get('class_name')?.toString(),
        } as Class
        return json({ addClass: await addClass(adminUuid, newClass) })
    }
    return json({ item: false })
}
