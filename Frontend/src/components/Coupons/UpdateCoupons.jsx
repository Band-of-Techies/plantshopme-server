// UpdateCoupons.js
import React, { useState, useEffect } from 'react';
import { MainWrapper, Wrapper } from '../ProductAdd/addProductWrapper';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import { TextField, Button, MenuItem, CircularProgress, Skeleton, Alert, Link } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateCoupons = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [couponData, setCouponData] = useState({
    code: '',
    type: '',
    value: '',
    usage: '',
    startDate: '',
    endDate: '',
    minvalue: '', // Added minvalue
  });
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/GetCoupon/${id}`);
        setCouponData(response.data);
      } catch (error) {
        console.error('Error fetching coupon details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isDeleted]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/UpdateCoupon/${id}`, couponData);
      toast.success('Coupon updated successfully');
      // You can redirect or perform other actions on success
    } catch (error) {
      console.error('Error updating coupon details:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`http://localhost:5000/api/DeleteCoupon/${id}`);
        setIsDeleted(true);
        toast.success('Coupon deleted successfully');
        // Navigate to /viewCoupons
        // navigate('/viewCoupons');
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='single'>
      <Sidebar />
      <div className='singleContainer'>
        <Navbar />
        <MainWrapper>
          <Wrapper>
            <h3>Update Coupon Details</h3>
            {loading ? (
              <Skeleton animation="wave" height={40} style={{ marginBottom: '20px' }} />
            ) : (
              <>
                <TextField
                  label="Coupon Code"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="code"
                  value={couponData.code}
                  onChange={(e) => setCouponData({ ...couponData, code: e.target.value })}
                />
                <TextField
                  select
                  label="Type"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="type"
                  value={couponData.type}
                  onChange={(e) => setCouponData({ ...couponData, type: e.target.value })}
                >
                  <MenuItem value="Percentage">Percentage</MenuItem>
                  <MenuItem value="Flat">Flat</MenuItem>
                </TextField>
                <TextField
                  label="Value"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="value"
                  value={couponData.value}
                  onChange={(e) => setCouponData({ ...couponData, value: e.target.value })}
                />
                <TextField
                  select
                  label="Usage"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="usage"
                  value={couponData.usage}
                  onChange={(e) => setCouponData({ ...couponData, usage: e.target.value })}
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Multiple">Multiple</MenuItem>
                </TextField>
                <div style={{ marginTop: '20px', marginBottom: '20px', color: 'dark' }}>
                  <strong>Existing Dates:</strong>
                  <div>Start Date: {formatDate(couponData.startDate)}</div>
                  <div>End Date: {formatDate(couponData.endDate)}</div>
                </div>
                <TextField
                  label="Start Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="date"
                  name="startDate"
                  value={couponData.startDate}
                  onChange={(e) => setCouponData({ ...couponData, startDate: e.target.value })}
                />
                <TextField
                  label="End Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="date"
                  name="endDate"
                  value={couponData.endDate}
                  onChange={(e) => setCouponData({ ...couponData, endDate: e.target.value })}
                />
                <TextField
                  label="Min Value"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="minvalue"
                  type="number"
                  value={couponData.minvalue}
                  onChange={(e) => setCouponData({ ...couponData, minvalue: e.target.value })}
                />
                <Button variant="contained" color="primary" onClick={handleUpdate} style={{ margin: '10px 0' }}>
                  Update Coupon
                </Button>
                <Button variant="outlined" color="error" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                  Delete Coupon
                </Button>
                <Alert
                  severity="success"
                  style={{
                    marginTop: '10px',
                    display: isDeleted ? 'flex' : 'none',
                    backgroundColor: 'white',
                    color: 'black',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  action={
                    <Button color="inherit" size="small" onClick={() => navigate('/viewCoupons')}>
                      VIEW COUPONS
                    </Button>
                  }
                  onClose={() => setIsDeleted(false)}
                >
                  <span>Coupon deleted successfully!</span>
                </Alert>
              </>
            )}
          </Wrapper>
        </MainWrapper>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateCoupons;
