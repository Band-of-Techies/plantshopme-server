// AddCoupons.js
import React, { useState } from 'react';
import { MainWrapper, Wrapper } from '../ProductAdd/addProductWrapper';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import { TextField, Button, MenuItem, Skeleton } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AddCoupons = () => {
  const currentDate = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(false);
  const [couponData, setCouponData] = useState({
    code: '',
    type: '',
    value: '',
    usage: '',
    startDate: currentDate,
    endDate: currentDate,
    minvalue: 0, // Added minvalue
    Exclusive: '',
  });

  const handleChange = (e) => {
    if (e.target.name === 'Exclusive') {
      // If the checkbox is changed, set Exclusive to 'True' if checked, and 'False' if unchecked
      setCouponData({ ...couponData, Exclusive: e.target.checked ? 'True' : 'False' });
    } else {
      // Otherwise, update the state as usual
      setCouponData({ ...couponData, [e.target.name]: e.target.value });
    }
  };
  



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/Addcoupons`, couponData);

      toast.success('Coupon added successfully');
      // You can redirect or perform other actions on success
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='single'>
      <Sidebar />
      <div className='singleContainer'>
        <Navbar />
        <MainWrapper>
          <Wrapper>
            <h3>Add Coupons here</h3>
            <div>
              <Link to="/viewCoupons" className="view-coupons-link">
                <Button variant="outlined" color="primary">
                  View Coupon Details
                </Button>
              </Link>
            </div>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Coupon Code"
                variant="outlined"
                fullWidth
                margin="normal"
                name="code"
                value={couponData.code}
                onChange={handleChange}
              />
              <div style={{padding:'10px', backgroundColor:'#b3ffb3',}}>
              <label style={{ marginLeft: '10px',marginTop:'10px' }}>Exclusive</label>
              <input
  type="checkbox"
  name="Exclusive"  // Corrected to match the state property
  onChange={handleChange}
/>
</div>

              <TextField
                select
                label="Type"
                variant="outlined"
                fullWidth
                margin="normal"
                name="type"
                value={couponData.type}
                onChange={handleChange}
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
                onChange={handleChange}
              />
              <TextField
                select
                label="Usage"
                variant="outlined"
                fullWidth
                margin="normal"
                name="usage"
                value={couponData.usage}
                onChange={handleChange}
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Multiple">Multiple</MenuItem>
              </TextField>
              <TextField
                label="Start Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="startDate"
                value={couponData.startDate}
                onChange={handleChange}
              />
              <TextField
                label="End Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="endDate"
                value={couponData.endDate}
                onChange={handleChange}
              />
              <TextField
                label="Min Value"
                variant="outlined"
                fullWidth
                margin="normal"
                name="minvalue"
                type="number"
                value={couponData.minvalue}
                onChange={handleChange}
              />
              <Button type="submit" variant="contained" style={{ backgroundColor: '#8BC34A', color: '#fff' }}>
                {loading ? <Skeleton variant="text" width={120} height={40} /> : 'Add Coupon'}
              </Button>
            </form>
          </Wrapper>
        </MainWrapper>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCoupons;
