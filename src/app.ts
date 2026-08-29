import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5172",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // data coming in json form frontend it could be anything

app.use( express.urlencoded({ extended: true, limit: "13kb", }) ); 
// data coming in url form frontend it could be anything (obj inside obj)

app.use(express.static("public")); 
// public file if you want to store in public file like img

app.use(cookieParser()); 
// accessing user browser cookie which is on server,
// for accessing and updating it => cookies is present in both (req, res)

console.log("this is my app application ❌❌❌❌❌❌");


// router
import userRouter from "./routes/userRoutes/user.route.js";
app.use("/api/v1/user", userRouter);

// GitHub OAuth routes — /auth/github and /auth/github/callback
import githubRouter from "./routes/githubRoutes/github.route.js";
app.use("/auth", githubRouter);


import repoRouter from "./routes/repository.routes.js"
app.use("/api/v1/github", repoRouter);


// Global error handler


//                                Backend Controller
//                                       │
//                                       │ throw new ApiError(409, "User already exists")
//                                       ↓
//                                   asyncHandler
//                                       │
//                                       │ .catch(error)
//                                       ↓
//                                   next(error)
//                                       │
//                                       ↓
//                                Express error middleware
//                                       │
//                                       │ err = error
//                                       ↓
//                                res.status(409).json(...)
//                                       │
//                                       ↓
//                                     Frontend
//                                       │
//                                       ↓
//                                response.json()
//                                       │
//                                       ↓
//                                data.message
//                                       │
//                                       ↓
//                                "User already exists"

app.use((err: any, req: any, res: any, next: any) => {
  console.error("ERROR:", err);

  return res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    data: err.data || null,
    message: err.message || "Something went wrong",
    error: err.error || [],
  });
});


export { app };