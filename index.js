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



















app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})