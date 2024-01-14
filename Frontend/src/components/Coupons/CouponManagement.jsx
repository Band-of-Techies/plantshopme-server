import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CouponManagement = () => {
    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <Wrapper>
                    <div>
                        
                    </div>
                </Wrapper>
            </div>
        </div>
    )
}

export default CouponManagement

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