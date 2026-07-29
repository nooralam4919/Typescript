// type assertion is a way in which we can tell the compiler about the type of a variable. It is used when we have more information about the type of a variable than TypeScript does.

let response: any = "56";
// (let numericLength: number = response.length) -> this will not work because response is of type any and length is not a property of any. We can use type assertion to tell the compiler that response is of type string.

let numericLength: number = (response as string).length;

type Book = {
    name: string;
}

let bookString = '{"name": "The Great Gatsby"}';
let objBook = JSON.parse(bookString) as Book; // bookString is stored in local storage and we know that it is of type Book, so we can use type assertion to tell the compiler that objBook is of type Book.
console.log(objBook.name); // this will work because objBook is of type Book and name is a property of Book.

const inputElement = document.getElementById("username") as HTMLInputElement; // we know that the element with id "username" is an input element, so we can use type assertion to tell the compiler that inputElement is of type HTMLInputElement.


let value:any
value = "Hello, World!";
value = [13,34,45,56];  // this all are valid because value is of type (any) and can hold any type of value.
value = 2.3333;
value.toUpperCase(); // this will work because value is of type (any) and toUpperCase is a method of string. But this is not safe because value can hold any type of value and toUpperCase is not a method of number or array.


let newValue:unknown // this will not work because (newValue) is of type unknown and we cannot assign any value to it without type assertion or type narrowing.
newValue = "Hello, World!";
newValue = [13,34,45,56];  
newValue = 2.3333;
if(typeof newValue === "string"){
     // this is type narrowing, we are checking the type of newValue and if it is of type string then we can assign it to a variable of type string.
     newValue.toLocaleLowerCase(); // this will work because we have narrowed the type of newValue to string and toLocaleLowerCase is a method of string.
}   



try{

}catch(error){
    if(error instanceof Error){ // if error is an instance of Error class then we can access the message property of error object.
        console.log(error.message);
    }
    // console.log(error.message); // this will not work because error is of type unknown and we cannot access the message property of unknown type.

    // 
    console.log("error", error)
}


// forcefull tell copiler the error is string datatype

const data: unknown = "Hello, World!";
const message: string = data as string; // we are telling the compiler that data is of type string and we can assign it to a variable of type string.

type Role = "admin" | "user" | "guest"; // this is a union type, it can hold any of the three values.

function redirectBasedOnRole(role: Role) :void{
    if(role === "admin"){
        console.log("Redirecting to admin dashboard");
        return
    }
    if(role === "user"){
        console.log("Redirecting to user dashboard");
        return
    }
   // role
    // this is super admin // this will give an error because role is of type Role and it can only hold the values "admin", "user" or "guest". But we have not handled the case when role is "guest". So we can use type assertion to tell the compiler that role is of type never and it will never reach this point.
}

