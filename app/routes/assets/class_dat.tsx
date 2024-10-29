// 連想配列を定義
let Classobj : {[key:string]:number[]}={
    "1": [1,2,3]
    // "ClassID": "座席のデータ"
};
  
export function isToClassSeats(id: string){
    console.log(id);
    return Classobj[id];
}

export function pushIdAndClass(id: string, seats:number[]){
    console.log(id);
    console.log(seats);
    let newObj : {[key:string]:number[]}={
        id: seats
    };
    Classobj = Object.assign({}, Classobj, newObj);
    // ここで連想配列作ってマージさせたい
    return true
}