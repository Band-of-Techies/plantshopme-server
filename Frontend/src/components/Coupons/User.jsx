import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const moment = require('moment-timezone');

const User = () => {
const location = useLocation()
const [addCoins ,setAddCoins] = useState()

const { prop} = location.state;

const navigate = useNavigate()

const calculateValidCoinsSum = (coinsArray) => {
    // Filter out entries with valid: true and sum the coins
    const validCoinsSum = coinsArray
      .filter((entry) => entry.valid)
      .reduce((sum, entry) => sum + entry.coins, 0);

    return validCoinsSum;
};

const totalCoins = calculateValidCoinsSum(prop?.coins)

function formatTimestamp(timestamp, valid) {
    try {
      let date = moment(timestamp);
      if (valid === 'Gift coins') {
        date = date.add(10, 'days');
      }
      const formattedDate = date.format('DD/MM/YY hh:mm A');
      return formattedDate;
    } catch (error) {
      // console.error('Error formatting timestamp:', error.message);
      return 'Invalid Date';
    }
  }
  
 const handleChange = (e)=>{
    const value = e.target.value
    setAddCoins(value)

 }
const  handleClick = async(e)=>{
    e.preventDefault()
    try {
        const resp = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/addCouponsAndCoins/${prop?._id}?coins=${addCoins}`,
            {}
          );
          
          navigate('/CouponManagement')
          
          toast.success("Gift Coins added...")
        return
    } catch (error) {
        toast.error("Something went wrong...")
        return error
    }
}

  return (
    <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <Wrapper>
                <div className='main-div'>
                <div className='add-coin'>
                <h3>User Data</h3>
                <div className='add-coin-div'>
                <p>Give coins</p>
                <div className="input-container">
                <input type="number" id="numericInput" name="numericInput" className="custom-input" onChange={handleChange}/>
                <button type='submit' onClick={handleClick}>Add</button>
                </div>
                </div>
                </div>
                <div className='user-credential'>
                 <p>User :<span> {prop?.name}</span></p>
                 <p>Email :<span> {prop?.email}</span></p>
                 <p>Coins :<span> {totalCoins}</span></p>
                 </div>
                 <section className='user-div'>
                 <div className='users-coins color'>
                    <p className='id'>Sl.No</p>
                    <p>Order Id</p>
                    <p>Coins</p>
                    <p>State</p>
                    <div>Added Date</div>
                    </div>
                    {prop?.coins.map((item,id)=>{
                        const { orderId,valid,lastAddedAt} =item
                        const formattedDate = formatTimestamp(lastAddedAt,orderId);
                        return(
                            <div key={id} className='users-coins'>
                                <p className='id'>{id+1}</p>
                                <p><Link to={`/ordercustomerdetails/${orderId}`}>{orderId}</Link></p>
                                <p>{item?.coins}</p>
                                <p style={{ color: valid ? '#228f47' : '#B19470' ,fontWeight:'bold'}}>{valid ? "Added": "Pending"}</p>
                                <p>{formattedDate}</p>
                            </div>  
                        )
                    })}
                 </section>
                </div>
                </Wrapper>
            </div>
  </div>
  )
}

export default User

const Wrapper = styled.section`
min-height:82vh;
background:#F5F7F8;
padding:2rem 1.5rem;
.main-div{
    background:#FFF;
    min-height:82vh;
    border-radius:5px;
    padding:0rem 1rem;
    
}
.user-credential{
    display:flex;
    flex-direction:row;
    gap:2rem;
    margin-bottom:1rem;
    span{
        font-weight:bold;
        color:#9DB2BF;
    }
}
.user-div{
    display:flex;
    flex-direction:column;

}
.add-coin{
    display:flex;
    justify-content:space-between;
    h3{
        height:fit-content;
        display:block;
      }
}
  .add-coin-div{
    height:fit-content;
    padding:2rem 0rem 2rem .5rem;
  }
  .add-coin h3 {
    text-align: left;
  }
  
  .input-container {
    display: flex;
    align-items: center;
  }
  
  p {
    margin-right: 10px;
  }
  
  .custom-input {
    padding: 8px;
    box-sizing: border-box;
    border-radius: 5px 0 0 5px  ;
    height:33px;
  }
  .custom-input:focus {
    outline: none;
  }
  
  button {
    padding: 8px 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 0 5px 5px 0 ;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
label {
    display: block;
    margin-bottom: 8px;
  }
  
  .custom-input {
    appearance: textfield; /* Remove the up and down arrows in some browsers */
    -moz-appearance: textfield; /* Firefox */
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
.users-coins{
    display:flex;
    flex-direction:row;
    padding-top:0.75rem;
    padding-bottom:0.75rem;
    flex: 1;
    border-bottom:1px solid #F3F3F3;
    transition: background 0.3s;
    div{
        flex:1;
      }
       p {
        flex: 1;
      }
      
    .id {
        flex: 0.2; /* Set the width of the ID */
      }
}
.users-coins:hover{
    background:#F3F3F3;
}
.color{
    background:#F3F3F3;
    padding: 0.75rem 0;
    p{
        font-weight:bold;
    }
    div{
        font-weight:bold;
    }
}

input{
    border:1px solid #d9e2ec;
    border-radius:5px;
    width:250px;
    height:30px;
  }
.header{
    display:flex;
    flex-direction:row;
    gap:5rem;
}
.warning{
    margin-bottom:1rem;
    background:#CCFFCC;
    display:inline-block;
    height:20px;
    margin-top:auto;
    margin-bottom:2rem;
}
.input-div{
    display:flex;
    flex-direction:row;
    align-items:center;
    gap:4rem;
    
}
h3{
    margin-left:0rem;
}
img{
    width:30px;
}
.input-div-main{
    margin-bottom:2rem;
}
.days-div{
    display:flex;
    flex-direction:row;
    align-items:center;
    gap:1rem;
}
.btn{
    margin-top:2rem;
    margin-bottom:1rem;
    font-weight:500;
    background:#228f47;
    cursor: pointer;
    color: #fff;
    border: transparent;
    border-radius: 5px;
    letter-spacing:1px;
    padding: 0.375rem 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition:  0.3s ease-in-out all;
    text-transform: capitalize;
    display: inline-block;
  }
  .btn:hover{
    box-shadow:  0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .update-delete-div{
    border-top:1.4px solid #d9e2ec;
  }
  .delete-btn{
    margin-top:1rem;
    font-weight:500;
    background:#D71313;
    cursor: pointer;
    color: #fff;
    border: transparent;
    border-radius: 5px;
    letter-spacing:1px;
    padding: 0.375rem 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition:  0.3s ease-in-out all;
    text-transform: capitalize;
    display: inline-block;
  }
`