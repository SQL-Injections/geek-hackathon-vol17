import { createAdmin, isExistAdmin, isExistAdminByUuid, createClass, getClassList as getClasses } from '~/model'
import { Class, Manager } from '~/model/model'

// createUser
export async function pushUsr(user: Manager) {
    if (!user.id || !user.password) {
        return false
    }
    // 既にユーザ名が存在する場合はfalseを返す
    const isExist = await isExistAdmin(user.id)
    if (isExist) {
        return false
    }

    // データ生成

    await createAdmin(user)
    return true
}

// createClass
export async function addClass(usrUuid: string, cls: Class) {
    if (!usrUuid || !cls.id) {
        return false
    }
    //ユーザが存在しないならエラー
    const isExist = await isExistAdminByUuid(usrUuid)
    if (!isExist) {
        return false
    }
    // TODO
    // クラス名が被っている場合にエラー出力
    // if (classList[usrId].some((c) => c.name === cls.name)) {
    //     return false
    // }
    await createClass(usrUuid, cls)
    return true
}

export async function getClassList(adminUuid: string) {
    return await getClasses(adminUuid)
}
