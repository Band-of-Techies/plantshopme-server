const router = require("express").Router();
const { User, validate } = require("../../models/Token/customer");
const Token = require("../../models/Token/token");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { log } = require("console");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


//login route
router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);

		res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

//google recaptcha validation which is coming from frontend
router.post("/verify-recaptcha", async (req, res) => {
	const { token } = req.body;
  
	const secretKey = process.env.GOOGLE_RECAPTCHA; // Replace with your actual secret key
  
	try {
	  const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
		params: {
		  secret: secretKey,
		  response: token,
		},
	  });
  
	  if (response.data.success) {
		// reCAPTCHA verification succeeded
		res.json({ success: true });
	  } else {
		// reCAPTCHA verification failed
		res.json({ success: false, errorCodes: response.data["error-codes"] });
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ success: false, error: "Error verifying reCAPTCHA" });
	}
  });



//token validation which is coming from frontend for login by token
router.get("/:id/verify/:token/", async (req, res) => {
	try {
	  const user = await User.findOne({ _id: req.params.id });
	  if (!user) return res.status(400).send({ message: "Invalid link" });
  
	  const token = await Token.findOne({
		userId: user._id,
		token: req.params.token,
	  });
	  if (!token) return res.status(400).send({ message: "Invalid link" });
  
	  if (!user.verified) {
		await User.updateOne({ _id: user._id }, { verified: true });
		await Token.deleteOne({
			userId: user._id,
			token: req.params.token,
		  }); // Delete the token
		res.status(200).send({ message: "Email verified successfully" });
	  } else {
		res.status(400).send({ message: "Email is already verified" });
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: "Internal Server Error", error: error.message });
	}
  });


// Define a route for creating a payment intent

// router.post('/create-payment-intent', async (req, res) => {
// 	const { updatedCartItems,
//         shipping_fee,
//         total,
//         user,checkoutData } = req.body;
// 		console.log(updatedCartItems);
// 		console.log(checkoutData);
// 	const calculateOrderAmount = () => {
// 		const amountInFils = (shipping_fee + total) * 100;
// 	  return shipping_fee + total;
// 	};
  
// 	try {
// 	  const paymentIntent = await stripe.paymentIntents.create({
// 		amount: calculateOrderAmount(),
// 		currency: 'AED',
// 	  });
// 	  console.log('Payment Intent ID:', paymentIntent);
// 	  console.log('Payment Intent ID:', paymentIntent.id);
// 	  res.status(200).json({ clientSecret: paymentIntent.client_secret });
// 	} catch (error) {
// 		console.log(error);
// 	  res.status(500).json({ error: error.message });
// 	}
//   });

// router.post('/create-payment-intent', async (req, res) => {
// 	const { updatedCartItems,
//         shipping_fee,
//         total,
//         user,checkoutData } = req.body;
// 		console.log(updatedCartItems);
// 		console.log(checkoutData);
// 	const calculateOrderAmount = () => {
// 		const amountInFils = (shipping_fee + total) * 100;
// 	  return amountInFils;
// 	};
  
// 	try {
// 	  const paymentIntent = await stripe.paymentIntents.create({
// 		amount: calculateOrderAmount(),
// 		currency: 'AED',
// 	  });
  
// 	  res.status(200).json({ clientSecret: paymentIntent.client_secret });
// 	} catch (error) {
// 		console.log(error);
// 	  res.status(500).json({ error: error.message });
// 	}
//   });

  // Define a route for getting data
//   router.get('/get-data', async (req, res) => {
// 	try {
// 	  // Code to fetch data from a database or any other data source
// 	  const data = await fetchDataFromDatabase(); // Replace this with your actual data retrieval logic
  
// 	  res.status(200).json({ data: data });
// 	} catch (error) {
// 	  console.error(error);
// 	  res.status(500).json({ error: error.message });
// 	}
//   });
  

  
module.exports = router;
