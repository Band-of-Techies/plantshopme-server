import React, { useState, useEffect } from 'react';
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

const Widget = ({ type }) => {
  const [selectedStatus, setSelectedStatus] = useState('total');
  const [totalUsers, setTotalUsers] = useState(null);

  const[selectedorderStatus,setselectedorderStatus]=useState('total');
  const[totalorder,setTotalorders]=useState(null);

  const[selectedamountStatus,setselectedamountStatus]=useState('total');
  const[totalamount,settotalamount]=useState(null);

  const[totalproducts,settotalproducts]=useState(null);

  const handleStatusChange = async (status) => {
    setSelectedStatus(status);
  };

  const handleOrderStatusChange = async (status) => {
    setselectedorderStatus(status);
  };

  const handleamountStatusChange = async (status) => {
    setselectedamountStatus(status);
  };


  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/total-users?status=${selectedStatus}`);
        const data = await response.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    fetchTotalUsers();
  }, [selectedStatus]);


  useEffect(() => {
    const fetchTotalorders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getorderfilter?dateRange=${selectedorderStatus}`);
        const data = await response.json();
        setTotalorders(data.count);
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    fetchTotalorders();
  }, [selectedorderStatus]);

  useEffect(() => {
    const fetchTotalamount = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getamountfilter?dateRange=${selectedamountStatus}`);
        const data = await response.json();
        settotalamount(data.totalAmount);
      } catch (error) {
        console.error('Error fetching total amount:', error);
      }
    };

    fetchTotalamount();
  }, [selectedamountStatus]);

  useEffect(() => {
    const fetchTotalproduct = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/total-products`);
        const data = await response.json();
        settotalproducts(data.totalProducts);
      } catch (error) {
        console.error('Error fetching total Products:', error);
      }
    };

    fetchTotalproduct();
  }, []);

  let data;

  //temporary
  const amount = 100;
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
       
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "PRODUCTS",
        isMoney: true,
       
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        {type === 'user' && (
          <span className="counter">
            {data.isMoney && "$"} {totalUsers !== null ? totalUsers : 'Loading...'}
          </span>)}

          {type === 'order' && (
          <span className="counter">
            {data.isMoney && "$"} {totalorder !== null ? totalorder : 'Loading...'}
          </span>)}
          {type === 'earning' && (
          <span className="counter">
            {data.isMoney && "AED"} {totalamount !== null ? totalamount : 'Loading...'}
          </span>)}

          {type === 'balance' && (
          <span className="counter">
            {data.isMoney && ""} {totalproducts !== null ? totalproducts : 'Loading...'}
          </span>)}
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        
        {type === 'user' && (

<div className="dropdown">
  <select value={selectedStatus} onChange={(e) => handleStatusChange(e.target.value)}>
    <option value="today">Today</option>
    <option value="thisMonth">This Month</option>
    <option value="total">Total</option>
  </select>
</div>
)}

{type === 'order' && (

<div className="dropdown">
  <select value={selectedorderStatus} onChange={(e) => handleOrderStatusChange(e.target.value)}>
    <option value="today">Today</option>
    <option value="thisMonth">This Month</option>
    <option value="total">Total</option>
  </select>
</div>
)}

{type === 'earning' && (

<div className="dropdown">
  <select value={selectedamountStatus} onChange={(e) => handleamountStatusChange(e.target.value)}>
    <option value="today">Today</option>
    <option value="thisMonth">This Month</option>
    <option value="total">Total</option>
  </select>
</div>
)}

{type === 'balance' && (

<div className="dropdown">
  {/* <select value={selectedamountStatus} onChange={(e) => handleamountStatusChange(e.target.value)}>
    <option value="today">Today</option>
    <option value="thisMonth">This Month</option>
    <option value="total">Total</option>
  </select> */}
</div>
)}
        {data.icon}

        
      </div>
    </div>
  );
};

export default Widget;
