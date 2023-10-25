const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middlewares/userMiddleware");
const {isAdmin} = require("../middlewares/customRoleMiddleware");
const {updateAdminRole, adminGetAllUsers, adminDeleteDoctor, adminSortUsers} = require("../controllers/adminController");

router.route("/updateAdminRole").post(isLoggedIn, updateAdminRole);
router.route("/getAllUsers").get(isLoggedIn, isAdmin, adminGetAllUsers)
router.route("/deleteDoctor").delete(isLoggedIn, isAdmin, adminDeleteDoctor);
router.route("/sortUsers").get(isLoggedIn, isAdmin, adminSortUsers)
module.exports = router;