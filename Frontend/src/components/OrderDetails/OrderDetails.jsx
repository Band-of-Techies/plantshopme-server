import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import PrintPage from './Invoice';
import TablePagination from '@mui/material/TablePagination';

import {
  Table,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import styled from 'styled-components';

const PaymentIntentsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [paymentIntents, setPaymentIntents] = useState([]);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
  const [selectedOrderStatus2, setSelectedOrderStatus2] = useState('');
  const [selectedpaymentData, setpaymentDataRegex] = useState('');
  const [loading, setLoading] = useState(true);


  const handleUserTypeChange = (e) => {
    setpaymentDataRegex(e.target.value);

  };

  const handleStartDateChange = (event) => {
    setSelectedStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setSelectedEndDate(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Here you can perform any actions when the page changes
    console.log('Page changed to:', newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // Here you can perform any actions when the rows per page changes
    console.log('Rows per page changed to:', event.target.value);
  };

  const handleOrderStatusChange = (event) => {
    // Set the selected order status directly without additional encoding
    setSelectedOrderStatus(event.target.value);
  };



  const handleUserClick = (intent) => {
    setSelectedIntent(intent);
    setDialogOpen(true);

  };

  const handleStatusChange = (intentId, newStatus) => {
    // Handle status change locally (no API call)
    setPaymentIntents((prevIntents) =>
      prevIntents.map((intent) =>
        intent._id === intentId ? { ...intent, Orderstatus: newStatus } : intent
      )
    );
    setSelectedOrderStatus2(newStatus);
  };

  const handleUpdateStatus = (intentId) => {
    axios
      .put(`${process.env.REACT_APP_BASE_URL}/update-status/${intentId}`, { Orderstatus: selectedOrderStatus2 })
      .then((response) => {
        setPaymentIntents((prevIntents) =>
          prevIntents.map((intent) =>
            intent._id === intentId ? { ...intent, Orderstatus: selectedOrderStatus2 } : intent
          )
        );
        setDialogOpen(false);
        toast.success('Order status updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating payment intent status:', error);
        toast.error('Failed to update order status.');
      });
  };

  const fetchPaymentIntents = () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    const apiUrl = `${process.env.REACT_APP_BASE_URL}/get-payment-intents`;
    const config = {
      headers: {
        'Authorization': `${token}` // Include the token in the Authorization header
      }
    };



    const params = {};
    if (selectedStartDate) params.startDate = selectedStartDate;
    if (selectedEndDate) params.endDate = selectedEndDate;
    if (selectedOrderStatus) params.Orderstatus = selectedOrderStatus;
    if (selectedpaymentData) params.paymentData = selectedpaymentData;

    axios
      .get(apiUrl, config, { params })
      .then((response) => {
        console.log('Response Data:', response.data);
        setPaymentIntents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching payment intents:', error);
        toast.error('Failed to fetch payment intents.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const decodeSpaces = (str) => str.replace(/%20/g, ' ');


  useEffect(() => {
    fetchPaymentIntents();
  }, [selectedStartDate, selectedEndDate, selectedOrderStatus, selectedpaymentData]);

  return (
    <div className='single'>
      <Sidebar></Sidebar>
      <div className='singleContainer'>
        <Navbar />
        <MainWrapper>
          <Wrapper>
            <h3>Order Details</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1, marginBottom: '20px', justifyContent: 'space-between', }}>
                <TextField
                  id="startDate"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  value={selectedStartDate}
                  style={{ paddingRight: '20px' }}
                  onChange={handleStartDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  id="endDate"
                  label="End Date"
                  type="date"
                  variant="outlined"
                  value={selectedEndDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <div style={{ paddingTop: '20px' }}>
                  <FormControl style={{ flex: 1, marginLeft: '20px' }}>
                    <Select onChange={handleUserTypeChange} value={selectedpaymentData} displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}>
                      <MenuItem value="" >Select Payment Method</MenuItem>
                      <MenuItem value="Cash on delivery"  >Cash On Delivery</MenuItem>



                    </Select>
                  </FormControl>
                </div>
              </div>
              <FormControl style={{ flex: 1, marginLeft: '20px' }}>
                <Select
                  value={selectedOrderStatus}
                  onChange={handleOrderStatusChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="" disabled>
                    Select Order Status
                  </MenuItem>
                  <MenuItem value="Order Placed">Order Placed</MenuItem>
                  <MenuItem value="Order Confirmed">Order Confirmed</MenuItem>
                  <MenuItem value="Shipping">Shipping</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Refund">Refund</MenuItem>
                </Select>
              </FormControl>

            </div>

            <div style={{ paddingTop: '10px' }}>
      {loading ? (
        <Skeleton height={50} count={5} />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SL No</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Payment Details</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Change Status</TableCell>
                  <TableCell>Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? paymentIntents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : paymentIntents
                ).map((intent, index) => (
                  <TableRow key={intent._id}>
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>
                      <Link to={`/ordercustomerdetails/${intent.orderId}`}>
                        <Button variant="outlined" color="primary" style={{ textTransform: 'none', color: 'blue' }}>
                          {intent.orderId}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {(isNaN((intent?.paymentData?.amount / 100).toFixed(2)) ? (' COD') : (intent?.paymentData?.amount / 100).toFixed(2) + ' AED')}
                    </TableCell>
                    <TableCell>{new Date(intent?.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{intent?.Orderstatus}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleUpdateStatus(intent._id)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
      component="div"
      count={100} // Total number of rows
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
</>
)}
</div>

            {selectedIntent && (
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} style={{ width: '1200px' }}>
                <DialogTitle style={{ borderBottom: '1px solid #ccc' }}>User Details</DialogTitle>
                <DialogContent style={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                  <Typography variant="body1">Name: {selectedIntent?.user?.name}</Typography>
                  <Typography variant="body1">
                    Address: {selectedIntent?.checkoutData?.country}, {selectedIntent?.checkoutData?.state},{' '}
                    {selectedIntent?.checkoutData?.city}, {selectedIntent?.checkoutData?.houseNumber},{' '}
                    {selectedIntent?.checkoutData?.landmark}
                  </Typography>
                  <Typography variant="body1">Phone: {selectedIntent?.checkoutData?.phone}</Typography>


                </DialogContent>
                <DialogTitle style={{ borderBottom: '1px solid #ccc' }}>Order Details</DialogTitle>
                <DialogContent style={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>

                  {selectedIntent?.updatedCartItems?.map((item, index) => (
                    <><Typography key={index} variant="body1">
                      Product Name: {item.title}
                    </Typography><Typography key={index} variant="body1">
                        Quantity: {item.productQuantity}
                      </Typography>
                      <Typography>
                        Pot:{item.potName.name}
                      </Typography>
                    </>
                  ))}


                  <Typography variant="body1">Order Status: {selectedIntent?.Orderstatus}</Typography>
                  <PrintPage intent={selectedIntent} style={{ marginTop: '10px', backgroundColor: '#4CAF50', color: 'white' }} />
                </DialogContent>
              </Dialog>
            )}


            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
          </Wrapper>
        </MainWrapper>
      </div>
    </div>
  );
};

export default PaymentIntentsTable;

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
`;
