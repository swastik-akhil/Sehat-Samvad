const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middlewares/userMiddleware");
const {isAdmin} = require("../middlewares/customRoleMiddleware");
const {updateAdminRole, adminGetAllUsers} = require("../controllers/adminController");

router.route("/updateAdminRole").post(isLoggedIn, updateAdminRole);
router.route("/getAllUsers").get(isLoggedIn, isAdmin, adminGetAllUsers)

module.exports = router;