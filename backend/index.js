const bcrypt = require("bcrypt")
const express = require("express")
const cors = require("cors")

const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.get("/", (req,res)=>{
    res.send("Hi from server")
})

app.listen(3000)
module.exports = app