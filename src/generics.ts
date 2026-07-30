// this is temple

function wrapInArray<T>(item: T): T[]{
    return [item]
}

// we can pass anythings 
wrapInArray("masal")
wrapInArray(434)
wrapInArray({})

function pair<A, B>(a: A, b: B): [A, B]{
    return [a, b]
}

pair("noor", "alam")
pair("noor", 34)
pair(44, "alam")
pair("noor", {})


// generic (interface)

interface Box<T> {
    content: T
}

// const numberBox: Box<T> = { // T could be anything like -> number, string, boolean
//     content: T
// }

const numberBox: Box<number> = {
    content: 34
}