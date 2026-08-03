import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5172",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    credentials: true
}));
app.use(express.json({limit: "16kb"})) // data comming in  json form frontEnd it could be anything
app.use(express.urlencoded({extended:true, limit : "13kb"})) //data comming in  url form frontEnd it could be anything (obj inside obj)
app.use(express.static("public")) // public file if you to store in public file like img 
app.use(cookieParser()) // accessing user brouser cookie which is on server, for accessing and updatating it => cookies is present in both (req, res)

console.log("this is my app application ❌❌❌❌❌❌")

export { app }