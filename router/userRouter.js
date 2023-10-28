const express = require("express");
const router = express.Router();
const {signup, signupVerification, login, logout, sendResetPasswordEmail,resetPassword, updatePassword} = require("../controllers/userController");
const {isLoggedIn} = require("../middlewares/userMiddleware");

router.route("/signup")
    .post(signup);

router.route("/signup/verifySignup/:signupToken")
    .post(signupVerification);

router.route("/login")
    .post(login);

router.route("/logout")
    .get(logout)

router.route("/password/reset")
    .post(sendResetPasswordEmail)

router.route("/password/reset/:token")
    .post(resetPassword)

router.route("/password/updatePassword")
    .post(isLoggedIn, updatePassword)



module.exports = router;