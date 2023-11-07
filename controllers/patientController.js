const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');
const {isLoggedin} = require('../middlewares/userMiddleware');
const emailHelper = require("../utils/emailHelper")
async function createAppointment(req,res){

    const {doctorId} = req.query;
    if(!doctorId){
        return res.status(400).json({status : "error", message : "doctorId is required"});
    }

    const patientId = req.user._id;
    const {date, description, amount} = req.body;

    if(!date || !description || !amount){
        return res.status(400).json({status : "error", message : "date, description and amount are required"});
    }

    const user = await User.findById(req.user._id);
    const doctor = await User.findById(doctorId);
    if(!doctor){
       return res.status(400).json({status : "error", message : "doctor not found"});
    }

    const newAppointment = await Appointment.create({
        patientId : user._id,
        doctorId : doctor._id,
        date : req.body.date,
        description : req.body.description,
        amount : req.body.amount
    })

    user.appointments.push(newAppointment._id);
    await user.save();
    console.log(`newAppointment : ${newAppointment}`)
    console.log(`user : ${user}`)

    const message = `We received a request to schedule your appointment. Your appointment is scheduled on ${newAppointment.date} with ${doctor.firstName} ${doctor.lastName}`;
    const options = {
        email : user.email,
        subject : "Appointment Scheduled",
        message
    }

    try{
        await emailHelper(options)
        return res.status(200).json({status : "success", message : "Email sent successfully"});
    }catch(e){
        console.log(e);
        return res.status(400).json({status : "failed", message : "Something went wrong while sending email"});
    }

}

async function showAppointments(req,res){
    try{
        const user = req.user;
        const appointments = await Appointment.find({patientId: user._id});
        return res.status(200).json({status: "success", appointments});
    }catch (e) {
        console.log(e)
    }
}

async function getDoctor(req,res){
    try{
        const {specialisation} = req.query;
        if ( !specialisation) {
            return res.status(400).json({status: "error", message: "doctorId is required"});
        }
        const doctors = await User.find({specialisation});
        if ( !doctors) {
            return res.status(400).json({status: "error", message: "doctors not found"});
        }
        return res.status(200).json({status: "success", doctors});
    }catch (e) {
        console.log(e)
    }
}


module.exports = {createAppointment, showAppointments,getDoctor}
//