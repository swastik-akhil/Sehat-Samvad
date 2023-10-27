const express = require("express");
const app = express();
const path = require("path");
const staticPath = path.join(__dirname, "./views");
app.use(express.static(staticPath));
const ejs = require("ejs");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const bodyParser = require("body-parser");
const cors = require("cors")

require("dotenv").config();
const cookieParser = require("cookie-parser")
const {PORT} = process.env;
require("./config/dbConnect").dbConnect();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(bodyParser.json({extended : true}));
app.use(cors())



//import routes
const userRouter = require("./router/userRouter");
const patientRouter = require("./router/patientRouter");
const adminRouter = require("./router/adminRouter");
const doctorRouter = require("./router/doctorRouter");
const staticRouter = require("./router/staticRouter");

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/static", staticRouter);













app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})