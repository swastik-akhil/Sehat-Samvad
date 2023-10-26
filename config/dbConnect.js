const mongoose = require("mongoose");
require('dotenv').config();
const {MONGODB_URL} = process.env;
exports.dbConnect = async ()=>{
	await mongoose.connect(MONGODB_URL, {
		useNewUrlParser : true,                     //this ensures that mongodb uses new url parser which is new and improved url parser
		useUnifiedTopology : true                   //this ensures that mongodb uses new unified topology engine
	})
		.then(()=>console.log(`DB CONNECTION : "SUCCESS"`))
		.catch((err)=>{
			console.log(`DB CONNECTION : "FAILED"`);
			console.log(err);
			// process.on('beforeExit', ()=>{console.log(`process is exiting`)})
			// process.exit(1);

		})
}
