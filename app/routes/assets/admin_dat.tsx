const adminDat : {[key: string]: {"password": string, "classes": Set<string>}} = {}

export function isValidUsr(usrId: string, password: string) {
    // ユーザがいなければ
    if (!adminDat[usrId]) {
        return false
    }
    //パスワードが一致するなら
    return (adminDat[usrId]["password"] === password) 
}

export function pushUsr(usrId: string, password: string) {
    // 既にユーザ名が存在する場合はfalseを返す
    if (adminDat[usrId]) {
        return false
    }

    // データ生成
    adminDat[usrId] = {"password": password, "classes": new Set()}
    return true
}

export function addClass(usrId: string, password: string, classId: string) {
    //ユーザが存在しないならエラー
    if (!adminDat[usrId]) {
        return false
    }
    // データ生成
    adminDat[usrId]["classes"].add(classId)
    return true
}
