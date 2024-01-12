const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const coinTransactionSchema = new mongoose.Schema({
    coins: { type: Number, required: true },
	orderId:{type:String },
	valid:{type:Boolean,default:false},
    lastAddedAt: { type: Date, default: Date.now },
});

const couponTransactionSchema = new mongoose.Schema({
    couponId: { type: String, required: true },
	orderId:{type:String },
    redeemedAt: { type: Date, default: Date.now },
});



const userSchema = new mongoose.Schema({

   name: { type: String, required: true },
	// lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	verified: { type: Boolean, default: false },
	coins: [coinTransactionSchema],
	redeemCoupon: [couponTransactionSchema],
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("CustomerNorm", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().label("First Name"),
		// lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
