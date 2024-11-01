export const adminDat: { [key: string]: { password: string; classes: Set<string> } } = {}

export function isValidUsr(usrId: string | undefined, password: string | undefined) {
    if (!usrId || !password) {
        console.log("(!usrId || !password)")
        return false
    }
    // ユーザがいなければ
    if (!adminDat[usrId]) {
        console.log("(!adminDat[usrId])")
        console.log("usr : ",adminDat[usrId])
        return false
    }
    //パスワードが一致するなら
    console.log("passの一致 : ",adminDat[usrId]['password'] === password)
    return adminDat[usrId]['password'] === password
}

// createUser
export function pushUsr(usrId: string | undefined, password: string | undefined) {
    if (!usrId || !password) {
        console.log("(!usrId || !password)")
        return false
    }
    // 既にユーザ名が存在する場合はfalseを返す
    if (adminDat[usrId]) {
        console.log("(adminDat[usrId])")
        console.log((adminDat[usrId]))
        return false
    }

    // データ生成
    adminDat[usrId] = { password: password, classes: new Set() }
    console.log(adminDat[usrId])
    return true
}

// createClass
export function addClass(usrId: string | undefined, password: string | undefined, classId: string | undefined) {
    if (!usrId || !password || !classId) {
        return false
    }
    //ユーザが存在しないならエラー
    if (!adminDat[usrId]) {
        return false
    }

    // TODO
    // クラス名が被っている場合にエラー出力

    // データ生成
    adminDat[usrId]['classes'].add(classId)
    return true
}

// 仮置き
export const getClassList = (classAdmin: string) => {
    return Array.from(adminDat[classAdmin].classes) || []
}
