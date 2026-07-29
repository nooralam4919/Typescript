function makeChai(type: string, cups: number){
    console.log(`making ${cups} of ${type}`)
}

makeChai("masalaTrea", 2)

function getChaiPrice(): string | number{ // return type of fuction like (void fun(){}) in c++
    return "34" // or 34
}

function ordeChai(type?: string){

}

function orderchai(type: string = "masalachai"){

}

// function createCahi(order:{
//     type: string,
//     sugar: number,
//     size: "small" | "large"
// }): number {
//     return 4;
// }


// same 

function createCahi(order:{type: string,sugar: number,size: "small" | "large"}): number {
    return 4;
}