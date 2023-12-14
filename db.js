const mongoose = require('mongoose')
require('dotenv').config();


module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		
		mongoose.connect('mongodb+srv://myplantstore11:CBhv18MmYmhbXwOv@myplantstore.1f9wpmy.mongodb.net/My_PlantStore-DB?retryWrites=true&w=majority', {
			socketTimeoutMS: 30000, // 30 seconds
			connectTimeoutMS: 30000, // 30 seconds
			// ... other options
		  });
        console.log("Connected to database successfully");

	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
	mongoose.set('strictQuery',false)
};
