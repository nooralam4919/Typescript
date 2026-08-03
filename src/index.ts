import dotenv from 'dotenv'
import { app } from './app.js'

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.json({message: "Hello from backendif hou"})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})  