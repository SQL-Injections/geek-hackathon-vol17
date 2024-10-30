
// 連想配列を定義
let Classobj : {[key:string]:Array<Array<number>>}={
    "1": [[1,1,0],[0,1,1],[1,0,1]]
    // "ClassID": "座席のデータ"
};
  
export function isToClassSeats(id: string){
    // Classobj[id].forEach(function( value ) {
    //     console.log(value);
    // });
    return Classobj[id];
}

export function pushIdAndClass(id: string, seats:Array<Array<number>>){
    console.log("id = "+id);
    // console.log(seats);
    Classobj[id]=seats;
    console.log("class add ",Classobj[id]);
    return true
}
