import { Class, Manager } from '~/model/model'

export type ClassList = {
    [managerId: string]: Array<Class>
}
export let adminList: Manager[] = []

export let classList: ClassList = {}

export function isValidUsr(user: Manager) {
    if (!user.id || !user.password) {
        return false
    }

    // 変更加わると思うから、一つにまとめる。
    // ユーザがいなければ
    //パスワードが一致するなら
    if (!adminList.some((manager) => manager.id === user.id && manager.password === user.password)) {
        return false
    }
}

// createUser
export function pushUsr(user: Manager) {
    if (!user.id || !user.password) {
        return false
    }
    // 既にユーザ名が存在する場合はfalseを返す
    if (adminList.some((manager) => manager.id === user.id)) {
        return false
    }

    // データ生成
    adminList = [...adminList, { id: user.id, password: user.password }]

    classList[user.id] = []

    return true
}

// createClass
export function addClass(usrId: string, password: string, cls: Class) {
    if (!usrId || !password || !cls.id) {
        return false
    }
    //ユーザが存在しないならエラー
    if (!adminList.some((manager) => manager.id === usrId && manager.password === password)) {
        return false
    }

    // TODO
    // クラス名が被っている場合にエラー出力

    if (classList[usrId].some((c) => c.name === cls.name)) {
        return false
    }

    // データ生成
    classList = {
        ...classList,
        [usrId]: [...classList[usrId], cls],
    }
    return true
}

// 仮置き
export const getClassList = (classAdmin: string) => {
    return classList[classAdmin] || []
}
