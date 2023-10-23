require("dotenv").config();
const cookieToken = (user,res)=>{
    const token = user.generateToken();
    const options = {
        expiresIn : new Date(Date.now() + process.env.COOKIE_TIME),
        httpOnly : true
    }
    // console.log("token", token);
    res.cookie("token", token, options);
    user.password = undefined;
}

module.exports = cookieToken;

