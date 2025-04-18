import express from "express"
import Users from "../models/Users.js"
import jwt from "jsonwebtoken";

const router = express.Router()

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"15d"});
}

router.post("/register", async (req, res) => {
    try{
        const {email, username, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password should be atleast 6 digits long"})
        }
        if(username.length < 3){
            return res.status(400).json({message:"Username should be atleast 3 digits long"})
        }

        // check if user already exists
        const existingEmail = await Users.findOne({$or:[{email}]});
        if (existingEmail) return res.status(400).json({message:"User already exists with this email"});

        const existingUsername = await Users.findOne({$or:[{username}]});
        if (existingUsername) return res.status(400).json({message:"User already exists with this username"});

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

        const user = new Users({
            email,
            username,
            password,
            profileImage,
        })
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user:{
                _id: user._id,
                username: user.username,
                email:user.email,
                profileImage:user.profileImage,
            },
        })
    }catch(error){
        console.log("Error in register route", error)
        res.status(500).json({message:"Internal server error"})
    };
});

router.post("/login", async (req, res) => {
    res.send("login")
});

router.get("/check-server", async (req, res) => {
    res.send("Server is running!!!")
})

export default router