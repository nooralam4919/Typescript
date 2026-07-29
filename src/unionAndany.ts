// union
let subscription: number | string = 1;
// let subscription: number | string = "1Million"; -> both are valid because of union type
// subscription = "1Million"; // valid because of union type


let apiRequest: 'pending' | 'success' | 'error' = 'pending';
apiRequest = 'success'; // valid because of union type
// apiRequest = 'loading'; // invalid because of union type is not defined