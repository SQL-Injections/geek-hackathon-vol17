const studentDat: { [key: string]: Set<string> } = {}

export async function isValidUsr(id: string | undefined, classid: string | undefined) {
    console.log(id, classid)
    if (!id || !classid) {
        return false
    } else {
        if (!studentDat[classid]) {
            return false
        } else {
            return studentDat[classid].has(id)
        }
    }
}

// createStudent
export async function pushUsr(id: string | undefined, classid: string | undefined) {
    if (!id || !classid) {
        return false
    } else {
        // クラスidが存在していないならクラスを生成する
        if (!studentDat[classid]) {
            studentDat[classid] = new Set()
        }
        // クラスidが存在しているならクラスに追加する
        studentDat[classid].add(id)
        return true
    }
}
