require("dotenv").config()
const bcrypt = require("bcrypt")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const { authenticateToken } = require("./utilities")
const User = require("./models/user.model")
const Story = require("./models/story.model")
mongoose.connect(process.env.connectionString)


const app = express()
app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.post("/create-account", async (req,res)=>{
    const {fullName, email , password } = req.body

    if(!fullName || !email || !password){
        return res.status(400).json({
            error : true,
            messsage : "All fields are required"
        })
    }

    const isUser = await User.findOne({
        email
    })

    if(isUser){
        return res.status(400).json({
            error : true,
            message : "User already exists"
        })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
        fullName,
        email,
        password : hashedPassword,
    })

    await user.save()

    const accessToken = jwt.sign({
        userId : user._id
    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : "72h"
    })


    return res.status(200).json({
        error : false,
        user : { fullName : user.fullName , email : user.email},
        accessToken,
        message : "Registration Successful"
    })
})

app.post("/login", async (req,res)=>{
    const {email, password } = req.body

    if(!email || !password){
        return res.status(400).json({
            error : true,
            message : "Email and password are required"
        })
    }

    const user = await User.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            error : true,
            message : "User does not exists"
        })
    }

    const isPasswordValid = await bcrypt.compare(password ,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            error : true,
            message : "Invalid Credentials"
        })
    }

    const accessToken = jwt.sign({
        userId : user._id
    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : '72h'
    })

    return res.status(200).json({
        error : false,
        user : {fullName : user.fullName, email : user.email},
        accessToken,
        messsge : "Login Successful"
    })
 })

app.get("/get-user", authenticateToken, async(req,res)=>{
    const { userId } = req.user
    const isUser = await User.findOne({_id : userId})

    if(!isUser){
        return res.sendStatus(401)
    }

    return res.json({
        user : isUser,
        message : ""
    })
})

app.post("/add-story", authenticateToken,  async(req,res)=>{
    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body
    const {userId} = req.user

    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return res.status(400).json({
            error : true,
            message : "All fields are required"
        })
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate))

    try{
        const timestory = new Story({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate : parsedVisitedDate
        })

        await timestory.save()
        res.status(201).json({
            story : timestory, message : "Added Succesfully"
        })
    } catch(error){
        res.status(400).json({
            error : true,
            message : error.message
        })
    }

})

app.listen(3000)
module.exports = app