import dotenv from 'dotenv'
import { app } from './app.js'

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.json({message: "this is the backend"});
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})  