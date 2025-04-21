import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const protectRoute = async(req, res, next) => {
    const token = req.header("Authorization").replace("Bearer", "");
    if(!token) return res.status(401).json({message: "No authentication token, access denied"});
    // remove extra spaces from token which might be present at the front or the back
    const trimmedToken = token.trim();
    const decoded = jwt.verify(trimmedToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if(!user) return res.status(401).json({message:"Toekn is not valid"});
    
    req.user = user;
    next();
}

export default protectRoute;