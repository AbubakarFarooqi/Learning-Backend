import express  from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

// middlewares

app.use(cors())

app.use(express.json()) 
app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded())
app.use(express.urlencoded({extended:true }))

app.use(express.static("public"))

app.use(cookieParser())

// Importing Router Router
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users",userRouter);
 

export default app