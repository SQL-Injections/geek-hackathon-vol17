
const studentDat : { [key: string]: Set<number> } = {}

export async function isValidUsr(id: number | undefined, classid: number | undefined){
    console.log(id, classid)
    if (id === undefined || classid === undefined) {
        return false
    }
    else{
        if (studentDat[classid.toString()] === undefined) {
            return false
        }
        else{
            return studentDat[classid.toString()].has(id)
        }
    }
}

export async function pushUsr(id: number | undefined, classid: number | undefined){
    if (id === undefined || classid === undefined || id === 0) {
        return false
    }
    else{
        // クラスidが存在していないならクラスを生成する
        if (studentDat[classid.toString()] === undefined) {
            studentDat[classid.toString()] = new Set()
        }
        // クラスidが存在しているならクラスに追加する
        studentDat[classid.toString()].add(id)
        return true
    }
}

