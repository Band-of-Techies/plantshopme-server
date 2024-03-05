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
import { handlePrint } from './handleinvoiceprint';

const StatusChange = ({ intentIdss }) => {
    const [paymentIntents, setPaymentIntents] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');

    const fetchPaymentIntent = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/get-payment-intent-by-id/${intentIdss.orderId}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (response.data && typeof response.data === 'object') {
                // Wrap the response data in an array
                setPaymentIntents([response.data]);
                setSelectedStatus(response.data.Orderstatus); // Set the initial status in the dropdown
            } else {
                console.error('Invalid data format:', response.data);
                toast.error('Failed to fetch payment intent.');
            }
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            toast.error('Failed to fetch payment intent.');
        }
    };

    const handleStatusChange = async (intentId) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update-status/${intentIdss._id}`, { Orderstatus: selectedStatus });
            setPaymentIntents(prevIntents =>
                prevIntents.map(intent =>
                    intent._id === intentId ? { ...intent, Orderstatus: selectedStatus } : intent
                )
            );
            toast.success('Order status updated successfully!');


            if (selectedStatus === 'Order Confirmed') {
                // If yes, send email
                try {
                 
                  const OrderId = response.data.orderId; // Assuming OrderId is returned in response
                  const to = response.data.user.email; // Assuming user object is returned in response
                  const name = response.data.user.name; // Assuming user object is returned in response
                  const userId = response.data.user.id;
      
                  // Print the PDF first
                  handlePrint(response.data);
      
                  // Then, send email
                  await sendEmail(OrderId, to, name, userId);
                } catch (error) {
                  console.error('Error sending email:', error);
                  // toast.error('Failed to send email');
                } finally {
                 
                }
              }


        } catch (error) {
            console.error('Error updating payment intent status:', error);
            toast.error('Failed to update order status.');
        }
    };


    const sendEmail = async (OrderId, to, name, userId) => {
        try {
         
          let additionalTo = ''; // Additional 'to' address from another endpoint
    
          // Check if user email is available in the response
          if (!to) {
    
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/customer/userEmail/${userId}`);
    
            additionalTo = response.data.email; // Additional 'to' address
          }
    
          // Combine the 'to' addresses
          const allTo = to ? [to, additionalTo] : additionalTo;
    
          // Send email with combined 'to' addresses
          await axios.post(`${process.env.REACT_APP_BASE_URL}/send-email-with-attachment`, { OrderId, to: allTo, name });
          toast.success('Email sent successfully');
        } catch (error) {
          console.error('Error sending email:', error);
          toast.error('Failed to send email. User email not found.');
        } finally {
         
        }
      };
    


    useEffect(() => {
        fetchPaymentIntent();
    }, []);

    return (
        <MainWrapper>
            <p>Order Status</p>
            {paymentIntents.map(intent => (
                <div key={intent._id}>
                    <FormControl fullWidth>
                        <Select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <MenuItem value="Order Placed">Order Placed</MenuItem>
                            <MenuItem value="Order Confirmed">Order Confirmed</MenuItem>
                            <MenuItem value="Shipping">Shipping</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Refund">Refund</MenuItem>
                        </Select>
                    </FormControl>
                    <div style={{paddingTop:'20px'}}> 
                        <Button
                        variant="outlined"
                        onClick={() => handleStatusChange(intent._id)}
                    >
                        Update
                    </Button></div>
                   
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
