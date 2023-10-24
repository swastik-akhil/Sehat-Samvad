const User = require("../models/userModel");
const {isLoggedin} = require('../middlewares/userMiddleware');
require("dotenv").config();
async function  updateDoctorRole(req,res){
	try{
		const {email, password, doctorKey} = req.body;
		if(!email || !password || !doctorKey){
			return res.status(400).json({status : "failed", message : "All fields are required"});
		}
		if(doctorKey !== process.env.DOCTOR_KEY){
			return res.status(400).json({status : "failed", message : "Invalid admin key"});
		}

		const user = await User.findOne({email}).select("+password")
		console.log(user); //TODO:
		const flag = await user.checkPassword(password);
		console.log(`flag: ${flag}`)
		if(!flag){
			return res.status(400).json({status : "failed", message : "Email or password does not match"});
		}

		user.role = "doctor";
		await user.save();
		return res.status(200).json({status : "success", message : "Role updated to Doctor successfully"});

	}catch(e){
		console.log(e);
	}
}


module.exports = {updateDoctorRole}
