import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FormControl,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import styled from 'styled-components';

const StatusChange = ({ intentIdss }) => {
    const [paymentIntents, setPaymentIntents] = useState([]);

    const fetchPaymentIntent = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/get-payment-intent-by-id/${intentIdss}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (response.data && typeof response.data === 'object') {
                // Wrap the response data in an array
                setPaymentIntents([response.data]);
            } else {
                console.error('Invalid data format:', response.data);
                toast.error('Failed to fetch payment intent.');
            }
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            toast.error('Failed to fetch payment intent.');
        }
    };
    

    const handleStatusChange = async (intentId, newStatus) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update-status/${intentIdss}`, { Orderstatus: newStatus });
            setPaymentIntents(prevIntents =>
                prevIntents.map(intent =>
                    intent._id === intentId ? { ...intent, Orderstatus: newStatus } : intent
                )
            );
            toast.success('Order status updated successfully!');
        } catch (error) {
            console.error('Error updating payment intent status:', error);
            toast.error('Failed to update order status.');
        }
    };

    useEffect(() => {
        fetchPaymentIntent();
    }, []);

    return (
        <MainWrapper>
          
                {paymentIntents.map(intent => (
                    <div key={intent._id}>
                        <FormControl fullWidth>
                            <Select
                                value={intent?.Orderstatus}
                                onChange={(e) => handleStatusChange(intent._id, e.target.value)}
                            >
                                <MenuItem value="Order Placed">Order Placed</MenuItem>
                                <MenuItem value="Order Confirmed">Order Confirmed</MenuItem>
                                <MenuItem value="Shipping">Shipping</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                                <MenuItem value="Refund">Refund</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="outlined"
                        >
                            Update
                        </Button>
                    </div>
                ))}
                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
           
        </MainWrapper>
    );
};

export default StatusChange;

const MainWrapper = styled.div`
  background: #f5f7f8;
  padding: 1rem;
  min-height: 86vh;
`;

const Wrapper = styled.section`
  background: #fff;
  min-height: 75vh;
  padding: 0.75rem;
  border-radius: 5px;
  h3 {
    margin-top: 0.5rem;
  }
  .highlighted-row {
    background-color: #cacbcd; /* Adjust the background color as per your preference */
  }
  
`;
