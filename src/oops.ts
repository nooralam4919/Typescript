class Chai
{
    flavour: string;
    price: number;
    constructor(flavour: string, pirce: number)
    {
        this.flavour = flavour;
        this.price = pirce;
    }
}

const makingChai = new Chai("adrak", 34);


class morderChai
{
    private _sugar = 2;
    // since it is private only gettera and setter can assecess the private member

    get sugar(){
        return this._sugar
    }

    set sugar(value: number){
        if(value>4) throw new Error("too much sugar")
            this._sugar = value
    }
}

const c = new morderChai()
c.sugar = 3

// static member class -> no object is needed
class Ekchai
{
    static shopeName = "chaiandcode"
    constructor(public flavour: string){}
}
console.log(Ekchai.shopeName)

// abstract call -> all the methond and func define in it

abstract class Drink
{
    abstract make():void
}

class Mychai extends Drink
{
    make(){
        console.log("making chai")
    }
}