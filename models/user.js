const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Define the user schema with required fields
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true }, // Change "email" to "username"
    password: { type: String, required: true },
});

// Method to generate a JSON Web Token (JWT) for user authentication
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

// Create the User model using the schema
const User = mongoose.model("user", userSchema);

// Validation function for user input data
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        username: Joi.string().required().label("Username"), // Change "email" to "username"
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
};

// Export the User model and validation function
module.exports = { User, validate };
