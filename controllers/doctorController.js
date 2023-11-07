const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const {isLoggedin} = require('../middlewares/userMiddleware');
require("dotenv").config();
const {mailHelper} = require("../utils/emailHelper");
async function  updateDoctorRole(req,res){
	try{
		const {password, doctorKey} = req.body;
		if(!password || !doctorKey){
			return res.status(400).json({status : "failed", message : "All fields are required"});
		}
		if(doctorKey !== process.env.DOCTOR_KEY){
			return res.status(400).json({status : "failed", message : "Invalid admin key"});
		}

		const user = await User.findOne({email : req.user.email}).select("+password")
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
	const {password, specialisation} = req.body;
	if(!password || !specialisation){
		return res.status(400).json({status : "failed", message : "All fields are required"});
	}
	const doctor = await User.findOne({email : req.user.email}).select("+password");
	
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

async function doctorMarkAppointmentComplete(req,res){
	const {appointmentId} = req.query;
	if(!appointmentId){
		return res.status(400).json({status : "failed", message : "appointmentId is required"});
	}
	const appointment = await Appointment.findById(appointmentId);
	if(!appointment){
		return res.status(400).json({status : "failed", message : "appointment not found"});
	}
	appointment.status = "completed";
	await appointment.save();

	const patientId = appointment.patientId;

	const options = {
		email : patientId.email,
		subject : "Appointment Completed",
		message : `Your appointment with ${req.user.firstName} ${req.user.lastName} is completed`
	}

	try{
		mailHelper(options)
		return res.status(200).json({status : "success", message : "Email sent successfully"});
	}
	catch(e){
		console.log(e);
		return res.status(400).json({status : "failed", message : "Something went wrong while sending email"});
	}
}

module.exports = {updateDoctorRole, doctorAddSpecialisation, doctorMarkAppointmentComplete}
