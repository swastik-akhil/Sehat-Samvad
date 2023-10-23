const mongoosoe = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
// import('nanoid').then(({ nanoid }) => {}).catch(err => {
//         console.error('Error loading nanoid:', err);
//     });
const userSchema = new mongoosoe.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please enter your first name"],
            trim: true,
            min: 3,
            max: 20,
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            validate: [validator.isEmail, "Please enter a valid email"],
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minlength: [6, "Password must be at least 6 characters long"],
            maxlength: [20, "Password must be at most 20 characters long"],
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "doctor", "admin"],
            default: "user",
        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordExpire: {
            type: Date,
            default: Date.now,
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
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.checkPassword = async function (userSendPassword) {
    return await bcrypt.compare(userSendPassword, this.password);
};

userSchema.methods.generateToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_TIME,
    });
};

userSchema.methods.generateForgotPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    //make sure to hash to taoken sent by the user and then comapre it with the hashed token in the database
    this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.forgotPasswordExpire = process.env.FORGOT_PASSWORD_EXPIRE_TIME;
    return resetToken;
};

module.exports = mongoosoe.model("User", userSchema);
