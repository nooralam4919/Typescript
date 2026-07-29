
// ****************** this is correct way buy you have to create a type for the object and then use that type in the function parameter. ******************

//  function makeChai(order: {type: string, sugar: number, size: "small" | "medium" | "large"}){
//     console.log(order);
//  }

//  function serveChai(order: {type: string, sugar: number, size: "small" | "medium" | "large"}){
//     console.log(order);
//  }

// ************************** Better way is to create a type for the object and then use that type in the function parameter. **************************

type chaiOrder = {
    type: string,
    sugar: number,
    size: "small" | "medium" | "large"
}

function makeChai(order: chaiOrder){
    console.log(order);
}

function serverChai(order: chaiOrder){
    console.log(order);
}


// type and interface
// both are similar but interface is more powerful than type because we can extend an interface but we cannot extend a type.



// this is type interface
type teaRecipe = {
    water: number,
    milk: number,
}

class MasalaChai implements teaRecipe{
    water = 100;
    milk = 50;
}


// interface

interface cupSize{
    size: "small" | "medium" | "large"
}   

class Chai implements cupSize{
    size: "small" | "medium" | "large" = "large"
}


// if there is 2 (type)

type baseChai = {tealeaves: number};
type extra = {masalaLevel: number};

type masalaChai = baseChai & extra;

const cup: masalaChai = {
    tealeaves: 2,
    masalaLevel: 3  // both must be declared inside the it becuser masalaChai is (& )
}