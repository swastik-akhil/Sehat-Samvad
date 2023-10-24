const express = require("express");
const router = express.Router();
const {createAppointment, showAppointments, getDoctor} = require("../controllers/patientController")
const {isLoggedIn} = require("../middlewares/userMiddleware")
const {isPatient} = require("../middlewares/customRoleMiddleware")


router.route("/createAppointment")
    .post(isLoggedIn, createAppointment);

router.route("/showAppointments")
	.get(isLoggedIn, showAppointments);

router.route("/getDoctor")
	.get(isLoggedIn, getDoctor);

// router.route("/getDoctor")
// 	.get(isLoggedIn, getDoctorAsPerSpecialisation);


module.exports = router;