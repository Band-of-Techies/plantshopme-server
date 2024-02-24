const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        // Validate the incoming request data
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        // Check if a user with the provided username (previously "email") already exists
        const user = await User.findOne({ username: req.body.username }); // Change "email" to "username"
        if (user)
            return res
                .status(409)
                .send({ message: "User with given username already exists!" }); // Change "email" to "username"

        // Generate a salt and hash the user's password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with the hashed password and save it to the database
        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        // Handle internal server errors
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
