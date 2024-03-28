import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PurchaseList.css';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PurchaseList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  useEffect(() => {
    fetchOrders();
    
  }, []);


  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/orders?startDate=${startDate}&endDate=${endDate}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleFilterClick = () => {
    fetchOrders();
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    const updatedOrders = orders.map(order => ({
      ...order,
      checked: e.target.checked
    }));
    setOrders(updatedOrders);
    setSelectedOrderIds(updatedOrders.map(order => order.orderId));
  };

  const handleCheckboxChange = (e, orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          checked: e.target.checked
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    setSelectedOrderIds(updatedOrders.filter(order => order.checked).map(order => order.orderId));
  };

  const navigate = useNavigate();
  // Function to send selected orderIds to the server
  const sendSelectedOrderIds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/get-purchaseList?orderIds=${selectedOrderIds.join(',')}`);
      // Convert the response object to JSON
      const responseData = JSON.stringify(response);
      navigate(`/AnalysisList/${selectedOrderIds}`);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className='single'>
      <Sidebar />
      <div className='singleContainer'>
        <Navbar />
        <div className="purchase-list-container">
          <div className="top-container" style={{ paddingTop: '60px', paddingLeft: '220px' }}>
            <h1>Purchase List</h1>
            <div className="filter-container">
              <div className="date-filter">
                <label htmlFor="startDate">Start Date:</label>
                <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} />
              </div>
              <div className="date-filter">
                <label htmlFor="endDate">End Date:</label>
                <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} />
              </div>
              <button onClick={handleFilterClick}>Filter</button>
             <div style={{paddingLeft:'10px'}}> <button onClick={sendSelectedOrderIds}>Analyse</button></div>
            </div>
          </div>
          <div className="order-table-container">
            <div className="table-info">
              <span>Total Orders: {orders.length}</span>
            </div>
            <table className="order-table">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    <label htmlFor="selectAll">Select All</label></th>
                  <th>Order ID</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton loading effect
                  <tr>
                    <td className="loading-skeleton" colSpan="3"></td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id}>
                      <td><input type="checkbox" checked={order.checked} onChange={(e) => handleCheckboxChange(e, order.orderId)} /></td>
                      <td>{order.orderId}</td>
                      <td>{order.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseList;
