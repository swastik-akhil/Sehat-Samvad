const express = require("express");
const router = express.Router();
const {staticSignup, staticLogin, staticForgotPasswordSendEmail, staticUpdatePassword, staticAdminDashboard, staticCreateAppointment} = require("../controllers/staticController");
const {isLoggedIn} = require("../middlewares/userMiddleware");
const {isAdmin, isDoctor} = require("../middlewares/customRoleMiddleware")

router.route("/signup")
    .get(staticSignup);

router.route("/login")
    .get(staticLogin);

router.route("/forgotPasswordSendEmail")
    .get(staticForgotPasswordSendEmail);

router.route("/updatePassword")
    .get(isLoggedIn, staticUpdatePassword);

router.route("/adminDashboard")
    .get(isLoggedIn, isAdmin, staticAdminDashboard);

router.route("/doctorDashboard")
    .get(isLoggedIn, isDoctor, staticAdminDashboard);

router.route("/patientDashboard/createAppointment")
    .get(isLoggedIn, staticCreateAppointment);

router.route("/patientDashboard/showAppointments").
    get(isLoggedIn, staticAdminDashboard);    

router.route("/patientDashboard/getDoctor")
    .get(isLoggedIn, staticAdminDashboard);

// router.route("/login")
//     .post(login);

// router.route("/logout")
//     .get(logout)

// router.route("/password/reset")
//     .post(sendResetPasswordEmail)

// router.route("/password/reset/:token")
//     .post(resetPassword)

// router.route("/password/updatePassword")
//     .post(isLoggedIn, updatePassword)



module.exports = router;