const User = require('../models/userModel');
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
        res.status(201).json({status : "success", message : "Account created successfully"});
        
        


    }catch(err){
        console.log(err);
    }
}



module.exports = {signup}