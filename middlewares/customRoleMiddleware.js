const User = require("../models/userModel")

function customRole(req, res, next){
    if(req.user.role!=="admin"){
        return res?.status(400)?.json({message : "role doesn't matched"})
    }
    next();
}

function isAdmin(req, res, next){
    if(req.user.role!=="admin"){
        return res?.status(400)?.json({message : "not an admin"})
    }
    next();
}


function isDoctor(req, res, next){
    console.log(req.user);
    if(req.user.role!=="doctor"){
        return res?.status(400)?.json({message : "not a doctor"})
    }
    next();
}

function isPatient(req, res, next){
    if(req.user.role!=="patient"){
        return res?.status(400)?.json({message : "not a patient"})
    }
    next();
}





module.exports = {customRole, isAdmin, isDoctor, isPatient}