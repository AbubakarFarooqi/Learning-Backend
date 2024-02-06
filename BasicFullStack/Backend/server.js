require("dotenv").config()
const express = require("express")

const app = express()
var cors = require('cors')


// enable all cors request i.e whitelist every thing
// app.use(cors())



app.get('/api/students', (req, res) => {
    const students = [
        {
            "name": "Azan",
            "class": "9th"
        },
        {
            "name": "usman",
            "class": "10th"
        },
        {
            "name": "umar",
            "class": "11th"
        },
    ]
    res.send(students)
});


app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
})