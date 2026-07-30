// without axios

interface Todo {
    userId: number,
    id: number,
    tittle: string,
    completed: boolean
}


const fetchData = async () => {
    try{
        const response = await fetch(
            //api call
        )
        if(!response.ok){
            throw new Error(`https error ${response.status}`)
        }

        const data: Todo = await response.json()
    }
    catch(error: any){
        // console.log(error.message)
       
    }
}