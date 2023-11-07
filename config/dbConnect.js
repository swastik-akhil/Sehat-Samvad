const mongoose = require("mongoose");
require('dotenv').config();
const {MONGODB_URL} = process.env;
exports.dbConnect = async ()=>{
	await mongoose.connect(MONGODB_URL)
		.then(()=>console.log(`DB CONNECTION : "SUCCESS"`))
		.catch((err)=>{
			console.log(`DB CONNECTION : "FAILED"`);
			console.log(err);
			// process.on('beforeExit', ()=>{console.log(`process is exiting`)})
			// process.exit(1);

		})
}
