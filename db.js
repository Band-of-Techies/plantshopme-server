const mongoose = require('mongoose')
require('dotenv').config();


module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Connected to database successfully");

	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};
