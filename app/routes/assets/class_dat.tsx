
// 連想配列を定義
let Classobj : {[key:string]:Array<Array<boolean|Array<string>>>}={
    "1": [[true,true,false],[false,true,true],[true,false,true]]
    // "ClassID": "座席のデータ"
};
// サーバーへの問い合わせが同時にあった場合に不整合を起こさないため
let blocked = false
  
export function isToClassSeats(id: string){
    // Classobj[id].forEach(function( value ) {
    //     console.log(value);
    // });
    return Classobj[id];
}

export function pushIdAndClass(id: string, seats:Array<Array<boolean>>){
    console.log("id = "+id);
    // console.log(seats);
    Classobj[id]=seats;
    console.log("class add ",Classobj[id]);
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
export function modifyClass(classId: string, usrId: string, x: number, y: number){
    if (!Classobj[classId]) {
        return false
    }
    while (blocked) {
        // blocked
    }
    //処理が終わるまでブロックする
    blocked = true
    //元居た場所が存在するならそれを削除する
    for (let i = 0; i < Classobj[classId].length; i++) {
        for (let j = 0; j < Classobj[classId][i].length; j++) {
            if (typeof(Classobj[classId][i][j]) === "boolean") {
                continue
            }
            if (Classobj[classId][i][j] instanceof Array) {
                const set = Classobj[classId][i][j] as Array<string>
                // もしsetにusrIdが存在するなら削除する
                if (set.includes(usrId)) {
                    //usrIdを削除
                    for (let k = 0; k < set.length; k++) {
                        if (set[k] === usrId) {
                            set.splice(k, 1)
                            break
                        }
                    }
                    Classobj[classId][i][j] = set
                }
                // 削除した結果その場所を選択している人がいないなら書き換え(別にset([])のままでも動きはする)
                if (set.length === 0) {
                    Classobj[classId][i][j] = true
                }
            }
        }
    }
    // その場所がまだ選択されていないなら
    if (Classobj[classId][y][x] === true) {
        Classobj[classId][y][x] = [usrId]
    }
    // もう誰かに選択されているなら
    else if (Classobj[classId][y][x] instanceof Set) {
        Classobj[classId][y][x].add(usrId)
    }
    console.log("class modify ",Classobj[classId], "y" , y, "x" , x);
    // 処理が終了したので解除
    blocked = false
    return Classobj[classId]
}