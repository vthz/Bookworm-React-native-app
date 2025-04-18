import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const protectRoute = async(req, res, next) => {
    const token = req.header("Authorization").replace("Bearer", "");
    if(!token) return res.status(401).json({message: "No authentication token, access denied"});

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if(!user) return res.status(401).json({message:"Toekn is not valid"});
    
    req.user = user;
    next();
}

export default protectRoute;