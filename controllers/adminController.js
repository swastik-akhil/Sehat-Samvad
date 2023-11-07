const User = require('../models/userModel');
const {isLoggedin} = require('../middlewares/userMiddleware');
require("dotenv").config();
async function adminGetAllUsers(req,res){
    try{
        const users = await User.find();
        return res.status(200).json({status : "success", message : "All users fetched successfully", data : users});
    
    }catch(e){
        console.log(e);
    }
}

async function updateAdminRole(req,res){
    try{
        const {email, password, adminKey} = req.body;
        if(!email || !password || !adminKey){
            return res.status(400).json({status : "failed", message : "All fields are required"});
        }
        if(adminKey !== process.env.ADMIN_KEY){
            return res.status(400).json({status : "failed", message : "Invalid admin key"});
        }

        const user = await User.findOne({email}).select("+password")
        console.log(user); //TODO:
        const flag = await user.checkPassword(password);
        console.log(`flag: ${flag}`)
        if(!flag){
            return res.status(400).json({status : "failed", message : "Email or password does not match"});
        }

        user.role = "admin";
        await user.save();
        return res.status(200).json({status : "success", message : "Role updated to Admin successfully"});

    }catch(e){
        console.log(e);
    }
}

async function adminDeleteDoctor(req,res){
    const {doctorId} = req.query;
    if(!doctorId){
        return res.status(400).json({status : "failed", message : "doctorId is required"});
    }
    const doctor = await User.findById(doctorId);
    if(!doctor){
        return res.status(400).json({status : "failed", message : "doctor not found"});
    }
    if(doctor.role !== "doctor"){
        return res.status(400).json({status : "failed", message : "user is not a doctor"});
    }
    await User.findByIdAndDelete(doctorId);
    return res.status(200).json({status : "success", message : "doctor deleted successfully"});
}

async function adminSortUsers(req,res){
    try{
        const {role} = req.query;
        const users = await User.find({role});
        return res.status(200).json({"message" : "success",users})

    }catch (e) {
        console.log(e)
    }
}





module.exports = {updateAdminRole, adminGetAllUsers, adminDeleteDoctor, adminSortUsers}
//