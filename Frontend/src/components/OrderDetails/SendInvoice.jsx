import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SendEmailButton = ({ intent }) => {
    const [loading, setLoading] = useState(false);

    const sendEmail = async () => {
        const OrderId = intent?.orderId;
        const to =intent?.user?.email;
        const name=intent?.user?.name;
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_BASE_URL}/send-email-with-attachment`, { OrderId,to,name}); // Send OrderId in the request body
            toast.success('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={sendEmail} disabled={loading}>
                {loading ? 'Sending Email...' : 'Send Email'}
            </button>
        </div>
    );
};

export default SendEmailButton;
