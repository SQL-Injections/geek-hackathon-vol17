// 連想配列を定義
let Classobj : {[key:string]:number[]}={
    "1": [1,2,3]
    // "ClassID": "ここ何のデータ？"
};
  
export function isValidClass(id: string){
    console.log(id);
    for (let key in Classobj) {
        if (key == id) {
            // ClassID is valid
            return true;
        }
    }
    return false
}

export function pushIdAndClass(id: number, seats: number){
    console.log(id);
    console.log(seats);
    // let newObj = {
    //     String(id): seats
    // };
    // Classobj = Object.assign({}, Classobj, newObj);
    // ここで連想配列作ってマージさせたい
    return true
}