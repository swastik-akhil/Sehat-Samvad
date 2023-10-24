const express = require("express");
const router = express.Router();
const {updateDoctorRole} = require("../controllers/doctorController")
const {isLoggedIn} = require("../middlewares/userMiddleware")
const {isDoctor} = require("../middlewares/customRoleMiddleware")

router.route("/updateDoctorRole")
	.post(isLoggedIn, updateDoctorRole);

module.exports = router;