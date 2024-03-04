import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
    const initialData = {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        userType: "",
    };

    const [data, setData] = useState(initialData);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const [userType, setUserType] = useState('');

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Set submitting state to true

        try {
            const url = `${process.env.REACT_APP_BASE_URL}/users`;

            // Include userType in the data object
            const postData = { ...data, userType };

            const { data: res } = await axios.post(url, postData);

            setIsSubmitting(false); // Reset submitting state
            navigate("/signup");

            setError(res.message);
            setData(initialData); // Reset form fields
        } catch (error) {
            setIsSubmitting(false); // Reset submitting state
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    // Render the signup form
    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/">
                        {/* Link to the login page */}
                        <button type="button" className={styles.white_btn}>
                            Dashboard
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    {/* Signup form */}
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className={styles.input}
                        />
                         <select onChange={handleUserTypeChange} value={userType} className={styles.select} name="userType">
                        <option value="">Select User Type</option>
                        <option value="Admin">Admin</option>
                        <option value="Order Manager">Order Manager</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="SEO Specialist">SEO Specialist</option>
                        <option value="Marketing Manager">Marketing Manager</option>
                        
                    </select>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn} disabled={isSubmitting}>
                            {/* Submit button */}
                            {isSubmitting ? "Processing..." : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
