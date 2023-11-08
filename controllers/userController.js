const User = require('../models/userModel');
const cookieToken = require('../utils/cookieToken');
const {mailHelper} = require('../utils/emailHelper');
const axios = require('axios');
require("dotenv").config();
const crypto = require("crypto");
async function signup (req,res){
    try{
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({status : "failed", message : "All fields are required"});
        }
        if(password.length <6){
            return res.status(400).json({status : "failed", message : "Password must be atleast 6 characters long"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({status : "failed", message : "user already exists"})
        }
        
        const user = await User.create({firstName, lastName, email, password});
        
        const signupToken = await user.generateSignupToken();
        await user.save({validateBeforeSave : false});

        const myUrl = `${req.protocol}://${req.get("host")}/api/v1/user/signup/verifySignup/${signupToken}`;
        
        const message = `We received a request to activate your account. Click the link below to activate it:\n ${myUrl}`;
        const options = {
            email : user.email,
            subject : "Account Activation",
            message
        }

        setTimeout(async () => {
            await User.findOneAndDelete({signupVerification: false });
            console.log("User deleted");
            // if(!user.signupVerification){
            //     user.deleteOne({user})
            // }
            // else{
            //     console.log("User already verified");
            // }                
        }, 5 * 60 * 1000); // 5 minutes

        try{
            mailHelper(options)
            return res.status(200).json({status : "success", message : "Email sent successfully"});
        }catch(e){
            clearTimeout();
            console.log(e);
            // user.signupToken = undefined;
            // user.signupTokenExpire = undefined;
            await User.deleteOne({user});
            // await user.save({validateBeforeSave : false});
            return res.status(400).json({status : "failed", message : "Something went wrong while sending email"});
        }
        
        // if(!user){
            // await cookieToken(user,res);
        //     return res.status(400).json({status : "failed", message : "Something went wrong while creating your account"});
        // }

        // await cookieToken(user,res);
        // return res.status(200).json({status : "success", message : "Account created successfully", user});
    }catch(err){
        console.log(err);
    }
}

async function signupVerification(req,res){
    const signupToken = req.params.signupToken;
    const encyrptedToken = crypto
        .createHash("sha256")
        .update(signupToken)
        .digest("hex");
        const user = await User.findOne({signupToken : encyrptedToken, signupTokenExpire : {$gt : Date.now()}})
        if(!user){
            return res.status(400).json({status : "failed", message : "Invalid token or token expired"});
        }

        user.signupVerification = true;
        user.signupToken = undefined;
        user.signupTokenExpire = undefined;
        await user.save();
        await cookieToken(user,res);
        return res.status(200).json({status : "success", message : "Account activated successfully"})
}


async function login(req,res){
    try {
        const {email, password} = req.body;
    
        if(!email || !password){
            return res.status(400).json({status : "failed", message : "All fields are required"});
        }

        const user = await User.findOne({email}).select("+password")
        console.log(user)
        if(!user){
            return res.status(400).json({status : "failed", message : "Invalid credentials"});
        }
        if(!user.signupVerification){
            return res.status(400).json({status : "failed", message : "Please verify your email"});
        }
        const flag = await user.checkPassword(password);
        console.log(`flag: ${flag}`)
        if(!flag){
            return res.status(400).json({status : "failed", message : "Email or password does not match"});
        }
        
        // const cookieToken =  (user,res)=>{
        //     const token = user.generateToken();
        //     const options = {
        //         expiresIn : new Date(Date.now() + process.env.COOKIE_TIME),
        //         httpOnly : true
        //     }
        //     res.cookie("token", token, options);
        //     user.password = undefined;

        // }

        await cookieToken(user,res);
        console.log("msg from user controller below")
        console.log(`cookie token generated is ${cookieToken}`)
        console.log(res.cookie)
        
        return res.status(200).json({status : "success", message : "Logged in successfully"});
    }
    catch(err){
        console.log(err);
    }
}

async function logout(req,res){
    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httpOnly : true
    })
    res.status(200).json({succeess : true, message : "logout success"});
}

async function sendResetPasswordEmail(req,res){
    const {email} = req.body;
    if(!email){
        return res.status(400).json({status : "failed", message : "Email is required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({status : "failed", message : "No user found with this email"});
    }
    
    if(!user.signupVerification){
        return res.status(400).json({status : "failed", message : "You are not a registered user"});
    }

    const forgotToken = await user.generateForgotPasswordToken();
    await user.save({validateBeforeSave : false});

    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${forgotToken}`;
    const message = `We received a request to reset your password. Click the link below to reset it:\n ${myUrl}`;
    const options = {
        email : user.email,
        subject : "Reset Password",
        message
    }

    try{
        mailHelper(options)
        return res.status(200).json({status : "success", message : "Email sent successfully"});
    }catch(e){
        console.log(e);
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpire = undefined;
        await user.save({validateBeforeSave : false});
        return res.status(400).json({status : "failed", message : "Something went wrong while sending email"});
    }

}

async function resetPassword(req,res){
    const token = req.params.token;
    const encyrptedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
        
    const user = await User.findOne({forgotPasswordToken : encyrptedToken, forgotPasswordExpire : {$gt : Date.now()}})
    if(!user){
        return res.status(400).json({status : "failed", message : "Invalid token or token expired"});
    }

    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).json({status : "failed", message : "Password and confirm password does not match"});
    }

    const {password} = req.body;
    user.password = password;
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpire = undefined;
    await user.save();
    
    cookieToken(user,res);

    return res.status(400).json({status : "success", message : "Password reset successfully, you can go ahead"});
    
}

async function updatePassword(req,res){
    const userId = req.user.id
    const user = await User.findById(userId).select("+password")
    const {password, newPassword, confirmPassword} = req.body;
    
    if(!password || !newPassword || !confirmPassword){
        return res.status(400).json({status : "failed", message : "All fields are required"});
    }
    
    if(newPassword !== confirmPassword){
        return res.status(400).json({status : "failed", message : "New password and confirm password does not match"});
    }
    
    if(password === newPassword){
        return res.status(400).json({status : "failed", message : "New password and old password cannot be same"});
    }
    
    const flag = await user.checkPassword(password);
    if(!flag){
        return res.status(400).json({status : "failed", message : "Incorrect Password"});
    }

    user.password = newPassword;
    await user.save();

    const clientIP = req.ip; // Assuming you're using Express, this gets the client's IP address
    const geoLocationApiUrl = `https://ipinfo.io/${clientIP}/json`;
    
    try{    
        const response = await axios.get(geoLocationApiUrl);

        console.log('Geolocation API Response:', response.data);

        if (response.status === 200 && response.data && response.data.city && response.data.region && response.data.country) {
            const locationInfo = `${response.data.city}, ${response.data.region}, ${response.data.country}`;
            message = `Your password has been updated at ${new Date()} from ${locationInfo}. If it's not you, please contact support.`;
        } else {
            message = `Your password has been updated at ${new Date()}. If it's not you, please contact support.`;
        }
        const options = {
            email : user.email,
            subject : "Password Updated",
            message : message
        }
        try {
            mailHelper(options);
        } catch (error) {
            console.log("error while sending mail", error);
        }

    }catch(e){
        console.log("error while fetching location");
        console.log(e);
    }



    return res.status(200).json({status : "success", message : "Password updated successfully"});
}


module.exports = {signup, login, logout, sendResetPasswordEmail, resetPassword, updatePassword, signupVerification}