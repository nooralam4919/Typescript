const chaiFlavours: string[] = ['masala', 'chai']
const chaiPrice: number[] = [223,33,3]

const rating: Array<number> = [2,34.4,23]



// arra of object;

type Chai = {
    name: string,
    price: number
}

const menu: Chai[] = [
    {name: "masala", price: 34},
    {name: "adrak", price: 44}
]


// readonly array -> the array can be define but not modifyed

const cities: readonly string[] =  ["delhi", "size"]
// cities.push("bihar") it will not work becouse it is readonly 

// 2D array
const table: number[][] = [
    [122,243,45],
    [34,34,34]
]

// tupples 
let chaiTupple: [string, number]
chaiTupple = ["chai", 33]
// chaiTupple = [22, "chsi"] order should not changed 

let userInfo: [string, number, boolean?]
userInfo = ["noor", 34, true]
userInfo = ["alam", 34] // also work


// readonly tupple 

// const location: readonly [number, number] = [232,4,233423]

// name tupple
const nameTupple: [name: string, price: number] = ["masal", 34]

// enum
enum CupSize {
    SMALL,
    MEDIUM,
    LARGE
}

const size = CupSize.LARGE
// const size1 = CupSize.SMALL


enum ChaiType {
    MASALA = "masala",
    GINGER = "ginger"
}
function makeChai(type:ChaiType){
    console.log(`making ${type}`)
}

makeChai(ChaiType.GINGER)