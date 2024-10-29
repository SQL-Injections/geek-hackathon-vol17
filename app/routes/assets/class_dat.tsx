
// 連想配列を定義
let Classobj : {[key:string]:number[][]}={
    "1": [[1,1,0],[0,1,1],[1,0,1]]
    // "ClassID": "座席のデータ"
};
  
export function isToClassSeats(id: string){
    console.log("isToClassSeats : id = "+id);
    console.log("Classobj[id] = "+ Classobj[id])
    console.log("Classobj[id].type = "+ typeof(Classobj[id]))
    Classobj[id].forEach(function( value ) {
    
        //配列の各要素を2倍にする
        console.log(value);
    
    });
    return Classobj[id];
}

export function pushIdAndClass(id: string, seats:Array<Array<number>>){
    console.log("id = "+id);
    // console.log(seats);
    Classobj[id]=seats;
    console.log("class add ",Classobj[id]);
    // ここで連想配列作ってマージさせたい
    return true
}
