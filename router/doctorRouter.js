const express = require("express");
const router = express.Router();
const {updateDoctorRole, doctorAddSpecialisation, doctorMarkAppointmentComplete} = require("../controllers/doctorController")
const {isLoggedIn} = require("../middlewares/userMiddleware")
const {isDoctor} = require("../middlewares/customRoleMiddleware")

router.route("/updateDoctorRole")
	.post(isLoggedIn, updateDoctorRole);

router.route("/addSpecialisation")
	.post(isLoggedIn, isDoctor, doctorAddSpecialisation);

router.route("/markAppointmentComplete")
	.patch(isLoggedIn, isDoctor, doctorMarkAppointmentComplete);

module.exports = router;
//