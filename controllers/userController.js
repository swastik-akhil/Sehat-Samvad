const User = require('../models/userModel');
const cookieToken = require('../utils/cookieToken');
const emailHelper = require('../utils/emailHelper');
require("dotenv").config();
async function signup (req,res){
    try{
        const {firstName, lastName, email, password } = req.body;
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({status : "failed", message : "All fields are required"});
        }
        const user = await User.create({firstName, lastName, email, password});
        if(!user){
            return res.status(400).json({status : "failed", message : "Something went wrong while creating your account"});
        }

        cookieToken(user,res);
        return res.status(200).json({status : "success", message : "Account created successfully"});
    }catch(err){
        console.log(err);
    }
}

async function login(req,res){
    try {
        const {email, password} = req.body;
    
        if(!email || !password){
            return res.status(400).json({status : "failed", message : "All fields are required"});
        }

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(400).json({status : "failed", message : "Invalid credentials"});
        }

        const flag = await user.checkPassword(password);
        
        if(!flag){
            return res.status(400).json({status : "failed", message : "Invalid credentials"});
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

        cookieToken(user,res);
        
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

async function forgotPassword(req,res){
    const {email} = req.body;
    if(!email){
        return res.status(400).json({status : "failed", message : "Email is required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({status : "failed", message : "No user found with this email"});
    }

    const forgotToken = await user.generateForgotPasswordToken();
    await user.save({validateBeforeSave : false});

    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/user/resetPassword/${forgotToken}`;
    const message = `Copy and paste this link in your browser to reset your password\n ${myUrl}`;
    const options = {
        email : user.email,
        subject : "Reset Password",
        message
    }

    try{
        await emailHelper(options)
        return res.status(200).json({status : "success", message : "Email sent successfully"});
    }catch(e){
        console.log(e);
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpire = undefined;
        await user.save({validateBeforeSave : false});
        return res.status(400).json({status : "failed", message : "Something went wrong while sending email"});
    }





}




module.exports = {signup, login, logout, forgotPassword}