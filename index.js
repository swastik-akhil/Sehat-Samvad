const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser")
const {PORT} = process.env;
require("./config/dbConnect").dbConnect();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());



//import routes
const userRouter = require("./router/userRouter");
const patientRouter = require("./router/patientRouter");
const adminRouter = require("./router/adminRouter");
const doctorRouter = require("./router/doctorRouter");

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/doctor", doctorRouter);














app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
//