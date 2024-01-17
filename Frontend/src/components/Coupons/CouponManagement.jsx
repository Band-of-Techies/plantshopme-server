import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { GrFormPrevious,GrFormNext } from "react-icons/gr";

const CouponManagement = () => {
    const [users,setUsers]=useState([])
    const [search,setSearch]=useState('')
    const navigate = useNavigate()
    const [loading ,setLoading] =useState(false)
    const [pages,setPages]=useState(1)

    const initialState = {
        search:'',
        page:1,
        limit:20,
        redeemCoupon:true,
        coins:true,
        
    }
    const[params ,setParams] =useState(initialState)
    const getCustomerData =  async()=>{
        setLoading(true)
        let url =`${process.env.REACT_APP_BASE_URL}/getCustomerData?page=${params.page}&limit=${params.limit}`
        if(params.search){
            url =url + `&search=${params.search}`
        }
        try {
            setLoading(false)
            const resp = await axios.get(url);
            setPages(resp.data.totalPages)
            setUsers(resp.data.combinedResults)
            return resp.data;
        } catch (error) {
            setLoading(false)
            toast.error("Something went wrong...")
            return error
        }
    }
    
    useEffect(()=>{
        getCustomerData()
    },[params.search,params.page])

      const handleInput = (e) => {
        const newSearchValue = e.target.value;
        setParams((prevState) => ({
          ...prevState,
          search: newSearchValue,
        }));
      };
    
      const [pageNo, setPageNo] = useState(params.page);
      const handleNext = (prop) => {
        let newPageNo = pageNo;
      
        if (prop === 'next' && pageNo < pages) {
          newPageNo = pageNo + 1;
        } else if (prop === 'prev' && pageNo > 1) {
          newPageNo = pageNo - 1;
        } else if (!isNaN(prop)) {
          newPageNo = prop;
        }
      
        setParams((prevState) => ({
          ...prevState,
          page: newPageNo,
        }));
      
        setPageNo(newPageNo);
      };
      

     const calculateValidCoinsSum = (coinsArray) => {
        // Filter out entries with valid: true and sum the coins
        const validCoinsSum = coinsArray
          .filter((entry) => entry.valid)
          .reduce((sum, entry) => sum + entry.coins, 0);
    
        return validCoinsSum;
    };
    
    
    const userCoinsData = (prop)=>{ 
     navigate(`/CouponManagement/${prop._id}`, { 
     state: {  prop }});
    }
    if(loading){
        return(
            <Wrapper>
                <p>Loading...</p>
            </Wrapper>
        )
    }

    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <Wrapper>
                    <div className='main-div'>
                    <h3>Users & Coins</h3><br/>
                    <div><input type='text' placeholder=' Name or Email' name="search" onChange={(e) => handleInput(e)}/></div>
                    <section className='users'>
                    <div className='user color'>
                    <p className='id'>Sl.No</p>
                    <p>User Name</p>
                    <p>Email</p>
                    <p>Valid Coins</p>
                    <div>Update</div>
                    </div>
                        {users && users.map((user,id)=>{
                            const {_id,name,coins,redeemCoupon,email} =user;
                            const validCoinsSum = calculateValidCoinsSum(coins);
                            
                            return(
                                <div key={_id} className='user'>
                                    <p className='id'>{id+1}</p>
                                    <p>{name}</p>
                                    <p>{email}</p>
                                    <p>{validCoinsSum}</p>
                                    <button onClick={(e)=>userCoinsData(user)}>Details</button>
                                </div>
                            )
                        })}
                    </section>
                    </div>
                      <div className='page-btns'>

                      {((pages && pages>1)) && (!loading) && <div className='page-btns'>
                     <button className='btn-prev' onClick={()=>handleNext('prev')}><GrFormPrevious /> prev</button>
                    {[...Array(pages).keys()].map((num) => {
                        if (num === 0 || num === pages - 1 || Math.abs(params.page - num - 1) <= 2) {
                    return (
                 <button  key={num}   onClick={() => handleNext(num + 1)}  className={`btn-no ${params.page === num + 1 ? 'highlight' : ''}`}>
                 {num + 1}
                 </button>
                );
               } else if (num === 1 || num === pages - 2) {
             return <span key={num}>…</span>;
            } else {
             return null;
            }
           })}
          <button onClick={()=>handleNext('next')} className='btn-next'>next<GrFormNext/></button></div>}
  
               </div>
                </Wrapper>
            </div>
        </div>
    )
}

export default CouponManagement

const Wrapper = styled.section`
min-height:110vh;
background:#F5F7F8;
padding:2rem 1.5rem;
.main-div{
    background:#FFF;
    min-height:82vh;
    border-radius:5px;
    padding:0rem 1rem;
    
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
.users{
    display:flex;
    flex-direction:column;

    margin-top:1.5rem;
    padding-bottom:1.5rem;

    justify-content:center;


    .user {
        display: flex;
        flex-direction: row;
        flex: 1;
        padding-top:0.5rem;
        padding-bottom:0.5rem;
        border-bottom:1px solid #F3F3F3;
        align-items: center;
        transition: background 0.3s;
      }
      div{
        flex:0.35;
      }
      .user p {
        flex: 1;
      }
      
      .user .id {
        flex: 0.2; /* Set the width of the ID */
      }
      
      button {
        flex:0.25;
        background-color: #4caf50;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      
      button:hover {
        background-color: #45a049;
      }
}
.user:hover{
    background:#F3F3F3;
}
.page-btns{
    margin-top:2.5rem;
    display:flex;
    flex-direction:row;
    justify-content:center;
    gap:1rem;
    width:100%;
    margin-bottom:2rem;
    
  }
  .btn-prev,.btn-next{
      background:#228f47;
      width:100px;
      padding:0.35rem;
      border-radius:10px;
      border:none;
      color:#FFF;
      font-weight:600;
      display:flex;
      justify-content:center;
      align-items:center;
      svg{
        font-size:1rem;
      }
  }
  .btn-no{
    min-width:10px;
    border:none;
    background:transparent;
    cursor:pointer;
  }
  .highlight {
    color: #228f47;
    font-weight:bold;
    border-bottom:2px solid #228f47;
  }
input{
    border:1px solid #d9e2ec;
    border-radius:5px;
    width:250px;
    height:30px;
  }
  input:focus {
    outline: none;
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