const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function isLoggedIn(req, res, next){
    try{
        const token = req.cookies.token;
        // console.log(token);
        if(!token) return res.status(401).json({errorMessage : "Unauthorized, no token found"});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if(!req.user.signupVerification){
            return res.status(401).json({errorMessage : "Unauthorized, please verify your email"});
        }
        // if(!user) return res.status(401).json({errorMessage : "Unauthorized, no user found"});
        next();

    }catch(e){
        console.log(e);
    }
}

module.exports = {isLoggedIn}
//