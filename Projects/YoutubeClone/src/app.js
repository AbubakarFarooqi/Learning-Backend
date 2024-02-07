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

 

export default app