const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please enter your first name"],
            trim: true,
            // min: 3,
            // max: 20,
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
            // min: 3,
            // max: 20,
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            // validate: [validator.isEmail, "Please enter a valid email"],
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            // minlength: [6, "Password must be at least 6 characters long"],
            // maxlength: [20, "Password must be at most 20 characters long"],
            select: false,
        },
        role: {
            type: String,
            enum: ["patient", "doctor", "admin"],
            default: "patient",
        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordExpire: {
            type: Date,
            default: Date.now()   //15 minutes
        },
        // TODO: DOCTOR ONLY FIELDS
        specialisation : [
            {
            type : String,
            enum: ['Cardiology', 'Orthopedics', 'General Surgery', 'Neurology', 'Urology', 'ENT (Ear, Nose, Throat)', 'Psychiatry', 'Dentistry', 'Other'],
            }
        ],
        appointments : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Appointment"
            }
        ],
        signupToken : {
            type : String,
        },
        signupTokenExpire : {
            type : Date,
            default : Date.now()
        },
        signupVerification : {
            type : Boolean,
            default : false
        },

        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    { timeStamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.pre("save", async function (next) {
    if (!this.isInit("role")) {
        return next();
    }
    if(this.role !== "doctor"){
        this.specialisation = undefined;
    }
    next();
})

userSchema.methods.checkPassword = async function (userSendPassword) {
    //console.log(`this.password== ${this.password}`)         //TODO:
    //console.log(`userSendPassword ${userSendPassword}`)     //TODO:
    const flag =  await bcrypt.compare(userSendPassword, this.password);
    return flag
};

userSchema.methods.generateToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_TIME,
    });
};

userSchema.methods.generateForgotPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    //make sure to hash to token sent by the user and then compare it with the hashed token in the database
    this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.forgotPasswordExpire = Date.now()+15*60*1000;
    return resetToken;
};

userSchema.methods.generateSingupToken = async function (){
    const signupToken = crypto.randomBytes(20).toString("hex");
    this.signupToken = crypto
        .createHash("sha256")
        .update(signupToken)
        .digest("hex");
    this.signupTokenExpire = Date.now()+2*60*1000;
    return signupToken;
}

module.exports = mongoose.model("User", userSchema);
