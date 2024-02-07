// require("dotenv").config({path:"./env"})
import dotenv from "dotenv"
import ConnectDB from "./db/database_connection.js";
import { connect } from "mongoose";
import app from "./app.js";
dotenv.config()

ConnectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log( `App is listening on PORT: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(`Database Connection Error ${err}`)
    process.exit(1)
})




