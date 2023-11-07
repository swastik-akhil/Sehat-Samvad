// import {nanoid} from "nanoid";

const mongoose = require('mongoose');
// import('nanoid').then(({ nanoid }) => {}).catch(err => {
//         console.error('Error loading nanoid:', err);
//     });
const appointmentSchema = new mongoose.Schema({
    patientId : {
        type : String,
        required : true
    },
    doctorId : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    // time : {
    //     type : String,
    //     required : true
    // },
    description : {
        type : String,
    },
    status : {
        type : String,
        enum : ["completed", "scheduled", "rejected"],
        default : "scheduled",
        required : "true"
    },
    amount : {
        type : String,
        enum : ["completed", "pending"],
        required : true
    },
    specialisation : {
        type : String,
        enum: ['Cardiology', 'Orthopedics', 'General Surgery', 'Neurology', 'Urology', 'ENT (Ear, Nose, Throat)', 'Psychiatry', 'Dentistry', 'Other'],
    },
},{timestamps : true});

// appointmentSchema.pre("save", async function (next) {
//     if (!this.isInit("appointmentId")) {
//         this.appointmentId = nanoid(5, "1234567890")
//         return next();
//     }
//     next();
// });

module.exports = mongoose.model('Appointment', appointmentSchema);
//