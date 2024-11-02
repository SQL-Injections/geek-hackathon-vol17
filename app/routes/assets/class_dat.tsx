import { Room, Student } from '~/model/model'
import { isValidUsr } from './student_dat'

export type SeatsInfo = {
    [classId: string]: Room
}

// 連想配列を定義
let Classobj: SeatsInfo = {
    '1': {
        row: 3,
        column: 3,
        seatAmount: 6,
        seats: [
            [true, true, false],
            [false, true, true],
            [true, false, true],
        ],
    },
    // "ClassID": "座席のデータ"
}
// サーバーへの問い合わせが同時にあった場合に不整合を起こさないため
let blocked = false

export function idToClassSeats(id: string) {
    return Classobj[id]
}

export function pushIdAndClass(id: string, seats: Room) {
    console.log('id = ' + id)
    // console.log(seats);
    Classobj[id] = seats
    console.log('class add ', Classobj[id])
    return true
}

/**
 * modifyClass
 * @param classId class id
 * @param usrId user(student) id
 * @param x column number
 * @param y row number
 * @returns if the class id exists, return true
 * @description
 *  modifyClassは指定されたクラスidの座席のデータを変更する
 *  そのクラスidが存在する場合、指定されたusrIdをその場所に追加する
 *  もし、指定されたusrIdが既に存在する場合には、削除する
 *  その結果その場所に誰もいない場合はtrueに書き換える
 *  そのクラスclassidが存在しない場合にはfalseを返す
 */
export function modifyClass(classId: string, usrId: string, usrName: string, x: number, y: number) {
    if (!Classobj[classId]) {
        return false
    }
    // ユーザーが無効であれば処理を終了する
    if (!isValidUsr(usrId, classId)) {
        return false
    }
    if (Classobj[classId].finished) {
        return false
    }
    while (blocked) {
        // blocked
    }
    //処理が終わるまでブロックする
    blocked = true
    const row = Classobj[classId].row
    const column = Classobj[classId].column
    const seats = Classobj[classId].seats
    //元居た場所が存在するならそれを削除する
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            if (seats[i][j] instanceof Array) {
                let set: Student[] = seats[i][j] as Student[]
                // もしsetにusrIdが存在するなら削除する
                if (set.some((value) => value.id === usrId)) {
                    //usrIdを削除
                    set = set.filter((student) => student.id !== usrId)

                    // 削除した結果その場所を選択している人がいないなら書き換え(別にset([])のままでも動きはする)

                    if (set.length === 0) {
                        Classobj[classId].seats[i][j] = true
                    }

                    Classobj[classId].seats[i][j] = set
                }
            }
        }
    }
    // その場所がまだ選択されていないなら
    if (Classobj[classId].seats[y][x] === true) {
        Classobj[classId].seats[y][x] = [{ id: usrId, displayName: usrName }]
    }
    // もう誰かに選択されているなら
    else if (Classobj[classId].seats[y][x] instanceof Array) {
        Classobj[classId].seats[y][x].push({ id: usrId, displayName: usrName })
    }

    console.dir(Classobj[classId], { depth: null })
    // 処理が終了したので解除
    blocked = false
    return Classobj[classId].seats
}

export const toggleFinished = (classId: string) => {
    Classobj[classId].finished = !Classobj[classId].finished
}

export const confirmSeats = (classId: string, room: Room) => {
    Classobj[classId] = room
    return Classobj[classId]
}
