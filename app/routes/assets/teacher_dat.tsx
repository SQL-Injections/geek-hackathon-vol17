const teacherDat : {[key: string]: {"password": string, "classes": Set<string>}} = {}

export function isValidUsr(usrId: string, password: string) {
    // ユーザがいなければ
    if (teacherDat[usrId] === undefined) {
        return false
    }
    //パスワードが一致するなら
    return (teacherDat[usrId]["password"] === password) 
}

export function pushUsr(usrId: string, password: string) {
    // 既にユーザ名が存在する場合はfalseを返す
    if (teacherDat[usrId] !== undefined) {
        return false
    }

    // データ生成
    teacherDat[usrId] = {"password": password, "classes": new Set()}
    return true
}

export function addClass(usrId: string, password: string, classId: string) {
    //ユーザが存在しないならエラー
    if (teacherDat[usrId] === undefined) {
        return false
    }
    // データ生成
    teacherDat[usrId]["classes"].add(classId)
    return true
}
