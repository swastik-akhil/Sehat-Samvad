const express = require("express");
const router = express.Router();
const {signup, login, logout, sendResetPasswordEmail,resetPassword, updatePassword} = require("../controllers/userController");
const {isLoggedIn} = require("../middlewares/userMiddleware");

router.route("/signup")
    .post(signup);

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