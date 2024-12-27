require("dotenv").config()
const bcrypt = require("bcrypt")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")
const { authenticateToken } = require("./utilities")
const User = require("./models/user.model")
const Story = require("./models/story.model")
const upload = require("./multer")
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



app.post("/image-upload", upload.single("image") , async (req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                error : true,
                message : "No image uploaded"
            })
        }
        
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`
        res.status(201).json({
            imageUrl
        })
    } catch (error){
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
})

app.delete("/delete-image", async(req,res)=>{
    const {imageUrl} = req.query
    if(!imageUrl){
        return res.status(400).json({
            error : true,
            message : "imageUrl parameter is required"
        })
    }

    try{
        const filename = path.basename(imageUrl)
        const filePath = path.join(__dirname, 'uploads', filename)

        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
            res.status(200).json({
                message : "Image Deleted Successfully"
            })
        } else {
            res.status(200).json({
                error : true,
                message : "Image not found"
            })
        }
    } catch (error){
        res.status(500).json({
            error : true,
            messsage : error.message
        })
    }
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

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

app.get("/get-all-stories", authenticateToken, async(req,res)=>{
    const {userId} = req.user

    try{
        const stories = await Story.find({userId : userId}).sort({isFavourite : -1})
    res.status(200).json({stories : stories})
    } catch (error){
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
})

app.put("/edit-story/:id", authenticateToken, async(req,res)=>{
    const {id} = req.params

    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body
    const {userId} = req.user

    if(!title || !story || !visitedLocation  || !visitedDate){
        return res.status(400).json({
            error : true,
            message : "All fields are required"
        })
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate))

    try {
        const timestory = await Story.findOne({_id : id , userId : userId})

        if(!timestory){
            return res.status(404).json({
                error : true,
                message : "Story not found"
            })
        }

        timestory.title = title
        timestory.story = story
        timestory.visitedLocation = visitedLocation
        timestory.imageUrl = imageUrl
        timestory.visitedDate = parsedVisitedDate

        await timestory.save()
        res.status(200).json({
            error : true,
            message : "Update Successful"
        })
    } catch(error){
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
})


app.delete("/delete-story/:id", authenticateToken ,async(req,res)=>{
    const { id } = req.params
    const { userId } = req.user

    try {
        const timestory = await Story.findOne({_id : id , userId : userId})

        if(!timestory){
            return res.status(404).json({
                error : true,
                message : "Story not found"
            })
        }

        await timestory.deleteOne({_id : id , userId : userId})

        const imageUrl = timestory.imageUrl

        const filename = path.basename(imageUrl)

        const filePath = path.join(__dirname , "uploads", filename)

        fs.unlink(filePath, (err)=>{
            if(err){
                console.error("Failed to delete image file: ", err)
            }
        })

        res.status(200).json({
            message : "Story deleted successfully"
        })
    } catch(error) {
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
})

app.put("/update-is-favourite/:id", authenticateToken, async (req,res)=>{
    const { id } = req.params
    const {isFavourite} = req.body
    const { userId } = req.user

    try {
        const timestory = await Story.findOne({_id : id, userId : userId})

        if(!timestory){
            return res.status(404).json({
                error : true,
                message : "Story not found"
            })
        }

        timestory.isFavourite = isFavourite

        await timestory.save()
        res.status(200).json({
            story : timestory,
            message : "Update Successful"
        })
    } catch(error){
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
})

app.get("/search", authenticateToken, async(req,res)=>{
    const {query} = req.query
    const {userId} = req.user

    if(!query){
        return res.status(404).json({
            error : true,
            message : "Query is required"
        })
    }

    try {
        const searchResults = await Story.find({
            userId : userId,
            $or : [
                {title : {$regex : query, $options : "i" }},
                {story : {$regex : query, $options : "i" }},
                {visitedLocation : {$regex : query, $options : "i" }},

            ],

        }).sort({isFavourite: -1})

        res.status(200).json({
            stories : searchResults
        })
    } catch(error){
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
})

app.get("/stories/filter", authenticateToken, async(req,res)=>{
    const {startDate, endDate} = req.query
    const { userId } = req.user

    try{

        const start = new Date(parseInt(startDate))
        const end = new Date(parseInt(endDate))

        const filteredStories = await Story.find({
            userId : userId,
            visitedDate : { $gte : start, $lte : end}
        }).sort({isFavourite : -1})

        res.status(200).json({
            stories : filteredStories
        })

    } catch(error){
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
})

app.listen(3000)
module.exports = app