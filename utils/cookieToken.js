require("dotenv").config();
const cookieToken = async (user,res,next)=>{
    try{
        const token = await user.generateToken();
        // console.log(token)
        const options = {
            expiresIn : new Date(Date.now() + process.env.COOKIE_TIME),
            httpOnly : true
        }
        // console.log("token", token);
        // console.log(`cookie token generated is ${token}`)
        user.password = undefined;
        return res.cookie("token", token, options);

        // next()
    }catch(e){
        console.log(e);
    }
}

module.exports = cookieToken;

// TODO: everything fine here 