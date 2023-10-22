const express = require("express");
const router = express.Router();
const {signup} = require("../controllers/user");
console.log(signup);
router.route("/signup").post(signup);
module.exports = router;