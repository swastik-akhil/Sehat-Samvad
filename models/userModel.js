const mongoosoe = require('mongoose');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
import('nanoid').then(({ nanoid }) => {
        const uniqueID = nanoid();
        console.log(uniqueID);
    }).catch(err => {
        console.error('Error loading nanoid:', err);
    });
const userSchema = new mongoosoe.Schema({
    firstName : {
        type : String,
        required : [true, "Please enter your first name"],
        trim : true,
        min : 3,
        max : 20
    },
    lastName: {
        type : String,
        required : false,
        trim : true,
        min : 3,
        max : 20
    },
    email : {
        type : String,
        required : [true, "Please enter your email"],
        validate : [validator.isEmail, "Please enter a valid email"],
        trim : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : [true, "Please enter your password"],
        min : [6, "Password must be at least 6 characters long"],
        max : [20, "Password must be at most 20 characters long"],
        select : false
    },
    role : {
        type : String,
        enum : ["user", "doctor", "admin"],
        default : "user"
    },
    forgotPasswordToken : {
        type : String
    },
    // forgotPasswordExpire : {
    //     type : Date,
    //     default : Date.now
    // },
    // createdAt : {
    //     type : Date,
    //     default : Date.now()
    // },
},{timeStamps : true});














module.exports = mongoosoe.model('User', userSchema);