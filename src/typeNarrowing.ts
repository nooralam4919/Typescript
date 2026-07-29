function chai(kind: string | number){
    if(typeof kind === "string"){
        return `making ${kind} chai`;
    }
    return `chai order: ${kind} cups`; // it is number type because of type narrowing
}

function serveChai(msg?: string){
    if(msg){
        return `Serving ${msg}`;
    }
    return "Serving default masala chai";
}

function orderChai(size: "small" | "medium" | "large" | number){
    if(size === "small"){
        return "Serving small chai";
    }
    if(size === "medium" || size === "large"){
        return `Serving ${size} chai`;
    }
    return `Serving ${size} cups of chai`;
}



class KulhadChai{
    serveChai(){
        return "Serving kulhad chai";
    }
}

class CuttingChai{
    serveChai(){
        return "Serving cutting chai";
    }  
}

function serveChaiFromVendor(chai: KulhadChai | CuttingChai){
    if(chai instanceof KulhadChai){
        return chai.serveChai();
    }
    return chai.serveChai();
}

// type narrowing with type predicate

type chaiOder = {
    type: string
    sugar: number
}

function isChaiOder(obj: any): obj is chaiOder{
    return(
        typeof obj == "object" &&
        obj != null &&
        typeof obj.type == "string" &&
        typeof obj.sugar == "number"
    )
}

function serveOder(item: chaiOder | string){
    if(isChaiOder(item)){
        return `Serving ${item.type} chai with ${item.sugar} sugar`;
    }
    return `Serving ${item} chai`; 
}



type MasalaChai = {type: "masala", sugar: number};
type GingerChai = {type: "ginger", amount: number};
type ElaichiChai = {type: "elaichi", sugar: number, amount: number};

type chai = MasalaChai | GingerChai | ElaichiChai;

function MakeChai(oder: chai){
    switch(oder.type){
        case "masala":
            return `Making masala chai with ${oder.sugar} sugar`;
            break;
            
        case "ginger":
            return `Making ginger chai with ${oder.amount} amount`;
            break;
        
        case "elaichi":
            return `Making elaichi chai with ${oder.sugar} sugar and ${oder.amount} amount`;
            break;
    }
}


// function isString(arr: unknown[]): arr is string[]{
//     // which means data type of arr is not defined but it will return string array
// }