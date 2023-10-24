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

async function doctorAddSpecialisation(req,res){
	const {email, password, specialisation} = req.body;
	if(!email || !password || !specialisation){
		return res.status(400).json({status : "failed", message : "All fields are required"});
	}
	const doctor = await User.findOne({email}).select("+password");
	if(!doctor){
		return res.status(400).json({status : "failed", message : "Doctor not found"});
	}
	const flag = await doctor.checkPassword(password);
	if(!flag){
		return res.status(400).json({status : "failed", message : "Email or password does not match"});
	}
	doctor.specialisation.push(specialisation);
	await doctor.save();
	return res.status(200).json({status : "success", message : "Specialisation added successfully"});

}



module.exports = {updateDoctorRole, doctorAddSpecialisation}
