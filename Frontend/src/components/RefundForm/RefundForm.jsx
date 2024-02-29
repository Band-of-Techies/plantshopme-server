import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import styled from 'styled-components';
import { Wrapper } from './addProductWrapper';
import Skeleton from '@mui/material/Skeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
const Form = styled.form`
  max-width: 800px;
  margin: 0 auto;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  margin-bottom: 16px;
  padding-left: 7px;
`;

const Select = styled.select`
  padding: 10px;
  width: 100%;
  margin-bottom: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
`;

const SkeletonContainer = styled.div`
  margin-bottom: 20px;
`;

const RefundForm = () => {
  const { id } = useParams();
  const [refundDetails, setRefundDetails] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefundDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/allRefundForm/${id}`);
        setRefundDetails(response.data);
      } catch (error) {
        console.error('Error fetching refund details:', error);
        toast.error('Error fetching refund details');
      } finally {
        setLoading(false);
      }
    }

    fetchRefundDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`${process.env.REACT_APP_BASE_URL}/update-Refundstatus/${id}`, { status });
      toast.success('Status updated successfully');
      // Optional: Fetch and update the refund details after status update
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/allRefundForm/${id}`);
      setRefundDetails(response.data);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='single'>
      <Sidebar />
      <div className='singleContainer'>
        <Navbar />
        <Wrapper>
            <h3>Refund Form</h3>
          {loading ? (
            <Skeleton height={150} width={300} style={{ marginBottom: '20px' }} />
          ) : (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6} style={{paddingRight:'10px'}}>
                  <Label>Order ID</Label>
                  <Input type='text' value={refundDetails.orderId} readOnly />
                </Grid>
                <Grid item xs={6}>
                  <Label>Transaction ID</Label>
                  <Input type='text' value={refundDetails.transactionId} readOnly />
                </Grid>
                <Grid item xs={6} style={{paddingRight:'10px'}}>
                  <Label>PaymentIntentId</Label>
                  <Input type='text' value={refundDetails.paymentIntentId} readOnly />
                </Grid>
                <Grid item xs={6}>
                  <Label>Status</Label>
                  <Input type='text' value={refundDetails.status} readOnly />
                </Grid>
                <Grid item xs={6} style={{paddingRight:'10px'}}>
                  <Label>Date</Label>
                  <Input type='text' value={refundDetails.createdAt} readOnly />
                </Grid>
                <Grid item xs={6}>
                  <Label>Reason</Label>
                  <Input type='text' value={refundDetails.reason} readOnly />
                </Grid>
                {/* Add more details based on your requirements */}
              </Grid>

              <Label>Status</Label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value=''>Select Status</option>
                <option value='Requested'>Requested</option>
                <option value='Processing'>Processing</option>
                <option value='Refunded'>Refunded</option>
              </Select>

              <Button type='button' onClick={handleStatusUpdate}>
                Update Status
              </Button>

              <Link to={`/ordercustomerdetails/${refundDetails.orderId}`}>
                              <Button variant="outlined" color="primary"
                               style={{ textTransform: 'none', color: 'blue' }}>
                                                             View Order Details
                              </Button>
                            </Link>
            </Form>
          )}
          <ToastContainer />
        </Wrapper>
      </div>
    </div>
  );
};

export default RefundForm;
