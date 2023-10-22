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
    // res.status(201).json({status : "success", message : "Account created successfully", user});
    // res.status(201).json({status : "success", "token" : token, user});
}

module.exports = cookieToken;




// const cookieToken = (user, res) => {
//     const token = user.generateToken();
//     const options = {
//         expiresIn: new Date(Date.now() + process.env.COOKIE_TIME),
//         httpOnly: true
//     };
//     console.log(token);
//     res.cookie("token", token, options);
//     user.password = undefined;
//     res.status(201).json({ status: "success" });
// }

// module.exports = cookieToken;
