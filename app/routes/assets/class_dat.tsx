// 連想配列を定義
let Classobj = {
    "001": []
  };
  
export function isValidClass(id: number | undefined ){
    console.log(id);
    return true
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