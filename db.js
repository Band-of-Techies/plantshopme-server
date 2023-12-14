const mongoose = require('mongoose')
require('dotenv').config();


module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		
		mongoose.connect(process.env.DB, {
			socketTimeoutMS: 30000, // 30 seconds
			connectTimeoutMS: 30000, // 30 seconds
			// ... other options
		  });
        console.log("Connected to database successfully");

	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
	
};
