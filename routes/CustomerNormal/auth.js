const router = require("express").Router();
const Token = require("../../models/Token/token");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const CustomerNorm = require('../../models/Token/customer');
const { User} = require("../../models/Token/customer");
const jwt = require("jsonwebtoken");


router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });
        //CustomerNormal to user
		let user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid credentials" }); // Changed message

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid credentials" }); // Changed message

		if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
				const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);
			}

			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}
		const token = user.generateAuthToken();
		res.status(200).send({ token: token, name: user.name, id:user._id,coins:user.coins,redeemCoupon:user.redeemCoupon,message: "Logged in successfully" });
	} catch (error) {
		console.error(error); // Log the error for debugging
		res.status(500).send({ message: "Internal Server Error" });
	}
});

//verify user by cookie
router.get('/verify', async (req, res) => {
	try {
	  // Get the token from the request headers
	  const token = req.headers['x-auth-token'];
	  // If no token is found, return an error
	  if (!token) {
		return res.status(401).send({ message: 'Access denied. No token provided.' });
	  }
  
	  // Verify the token
	  try {
		const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY, { algorithm: 'HS256' });
		req.user = decoded;
		res.status(200).send({ message: 'Token is valid' });
	  } catch (ex) {
		res.status(400).send({ message: 'Invalid token.' });
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: 'Internal Server Error' });
	}
  });

  router.post("/forgotpassword", async (req, res) => {
	try {
	  // Check if the email is provided in the request body
	  if (!req.body.email) {
		return res.status(400).send({ message: "Email is required" });
	  }
  
	  // Find the user with the provided email
	  let user = await User.findOne({ email: req.body.email });
	  if (!user) {
		return res.status(404).send({ message: "User not found" });
	  }
  
	  // Generate a unique token for password reset
	  const token = jwt.sign({ userId: user._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: '1h', // Set expiration time, adjust as needed
	  });
  
	  // Save the token in the database associated with the user
	  await Token.findOneAndUpdate(
		{ userId: user._id },
		{ token: token },
		{ upsert: true, new: true }
	  );
  
	  // Construct the URL for the password reset link
	  const resetUrl = `${process.env.BASE_URL}resetpassword/${token}`;
  
	  // Send an email with the reset link
	  await sendEmail(user.email, "Reset Password", resetUrl);
  
	  return res.status(200).send({ message: "Password reset instructions sent to your email" });
	} catch (error) {
	  console.error(error); // Log the error for debugging
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
  
  router.put("/updatepassword", async (req, res) => {
	// console.log(req.body)
	try {
	  // Check if the email, password, and token are provided in the request body
	  const { error } = validateUpdatePassword(req.body);
	  if (error) {
		return res.status(400).send({ message: error.details[0].message });
	  }
  
	  // Verify the token
	  const decodedToken = jwt.verify(req.body.token, process.env.JWTPRIVATEKEY);
	  const userId = decodedToken.userId;
  
	  // Find the user with the provided user ID
	  let user = await User.findById(userId);
	  if (!user) {
		return res.status(404).send({ message: "User not found" });
	  }
  
	  // Hash the new password
	  const salt = await bcrypt.genSalt(10);
	  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
	  // Update the user's password
	  await User.findByIdAndUpdate(userId, { password: hashedPassword });
  
	  return res.status(200).send({ message: "Password updated successfully" });
	} catch (error) {
	  console.error(error); // Log the error for debugging
	  if (error.name === 'TokenExpiredError') {
		return res.status(400).send({ message: 'Token has expired' });
	  }
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
  
  
  
  // Other routes...
  const validateUpdatePassword = (data) => {
	const schema = Joi.object({
	  email: Joi.string().email().required().label("Email"),
	  password: Joi.string().required().label("Password"),
	  token: Joi.string().required().label("Token"),
	});
	return schema.validate(data);
  };
  
  
  
const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
