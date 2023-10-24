const express = require("express");
const router = express.Router();
const {updateDoctorRole, doctorAddSpecialisation} = require("../controllers/doctorController")
const {isLoggedIn} = require("../middlewares/userMiddleware")
const {isDoctor} = require("../middlewares/customRoleMiddleware")

router.route("/updateDoctorRole")
	.post(isLoggedIn, updateDoctorRole);

router.route("/addSpecialisation")
	.post(isLoggedIn, isDoctor, doctorAddSpecialisation);

module.exports = router;