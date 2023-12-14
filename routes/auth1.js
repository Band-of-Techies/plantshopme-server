const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
    try {
        // Validate the incoming request data
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        // Find a user by their username (previously "email")
        const user = await User.findOne({ username: req.body.username }); // Change "email" to "username"
        if (!user)
            return res.status(401).send({ message: "Invalid Username or Password" }); // Change "Email" to "Username"

        // Compare the provided password with the stored hashed password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Username or Password" }); // Change "Email" to "Username"

        // Generate a JWT token for the authenticated user
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        // Handle internal server errors
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Validation function for the request data
const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("Username"), // Change "email" to "username"
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;
