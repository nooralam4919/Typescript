const chai = {
    name: "masal chai",
    price: 20,
    isHot: true
}


// typescript infer this into 

// {
//     name: string;
//     price: number:
//     isHot: boolean
// }


//  declaring object types

let mytea: {
    name: string,
    price: number,
    isHot: boolean
}

mytea = {
    name: "ginger Tea",
    price: 230,
    isHot: true
}

type Tea = {
    name: string,
    price: number,
    ingrediant: string[];
}

const adrakChai: Tea = {
    name: "adrakchaihai",
    price: 2300,
    ingrediant: ["ginger", "suger", "water"]
}

type User = {
    name: string,
    password: string
}

const u: User = {
    name: "noor",
    password: "123"
}



// data split out

type Item = {name: string, quantity: number};
type Address = {steet: string, pin: number};

type Order = {
    it: string,
    item: Item[],  // it is like (...) spred operator in js, it will insert all {name: string, quantity: number}; into item
    address: Address[]
}


// (*(*******((*(*((*(**((**((((()))))))))))))))

// type Chai = {
//     name: string,
//     price: number
//     isHot: boolean
// }

// const updateChai = (updates: Partial<Chai>) =>{
//     console.log("updating chai with ", updates);
// }

// updateChai({price:20}) // the function only use price member and distart all the object in Chai
// updateChai({name:"chai", price: 24}) // only send the (name and price) member to updateChai funtion
// // updateChai({}) crete issue  


type Chai = {
    name: string,
    price: number
    isHot: boolean
}

const updateChai = (updates: Required<Chai>) =>{
    console.log("updating chai with ", updates);
}

// updateChai({price:20}) error all member of object is required must 

updateChai({name:"chai", price: 20, isHot: true}) // this will work


// in this wee pick only what we want

// type ChaiLelo = {
//     name: string,
//     price: number,
//     isHot: boolean,
//     ingredients: string[]
// }

// type BasicChaiInfo = Pick<ChaiLelo, "name" | "price">; // only take (name and price) from the chaiLelo
// const chaiInfo: BasicChaiInfo = {
//     name: "lemon tree",
//     price: 10
// }


type ChaiLelo = {
    name: string,
    price: number,
    isHot: boolean,
    secretingredients: string[]
}

type BasicChaiInfo = Omit<ChaiLelo,"secretingredients">; // it will hide the secretingredients
