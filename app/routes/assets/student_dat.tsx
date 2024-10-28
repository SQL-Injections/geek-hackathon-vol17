
const studentDat : { [key: string]: Set<number> } = {}

export async function isValidUsr(id: number | undefined, classid: string | undefined){
    console.log(id, classid)
    if (id === undefined || classid === undefined) {
        return false
    }
    else{
        if (studentDat[classid] === undefined) {
            return false
        }
        else{
            return studentDat[classid].has(id)
        }
    }
}

export async function pushUsr(id: number | undefined, classid: string | undefined){
    if (id === undefined || classid === undefined || id === 0) {
        return false
    }
    else{
        // クラスidが存在していないならクラスを生成する
        if (studentDat[classid] === undefined) {
            studentDat[classid] = new Set()
        }
        // クラスidが存在しているならクラスに追加する
        studentDat[classid].add(id)
        return true
    }
}

