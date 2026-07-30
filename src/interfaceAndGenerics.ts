// (interface ) is just like as (type) 
// interface just create stucture not inserting the data
// can't write function in interface
// which is just object stucture not generate js code 

interface Chai
{
    flavour: string;
    price: number,
    milk? : boolean
};

const shop: Chai = {
    flavour: "lemon",
    price: 34,
    milk: true
};

interface marketShop {
    readonly id: number,
    name: string
}
const s: marketShop = {id: 23, name: "nooralam"}
// s.id = 3 // can't be changed becouse we use the readonly 

interface DiscountCalculator
{
    // declare function
    (price: number) : number
}

// use it
const apply50: DiscountCalculator = (p) => p*0.5 

// 
interface TeaMachin
{
    start(): void
    stop(): void
}

const machin: TeaMachin = {
    start(){
        console.log("machine is started")
    },
    stop(){
        console.log("machine is stopped")
    }
}


// interfaces with same name is goining to merge into one

interface User
{
    name: string
}

interface User{
    age: number
}

const u: User = {
    name: "noor",
    age: 34
}

// interface will extand just like class

interface A {user: string};
interface B {age: number};

interface C extends A, B {
    user: "noor",
    age: 34
}