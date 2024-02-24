import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import Navbar from '../navbar/Navbar'
import { TextField } from '@mui/material'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import tick from '../../assets/checkmark.png'


const Locations = () => {
  const [place, setplace] = useState('')
  const [isDays, isSetDays] = useState('')
  const [data, setData] = useState([]);
  const [updatePlace, setUpdatePlace] = useState('')
  const [updateDays, setUpdateDays] = useState('')
  const [isCleared, setIsCleared] = useState(false);
  const [isPost, setIsPost] = useState(false)
  const [locations, setLocations] = useState();
  const [isUpdated, setIsUpdated] = useState(false)


  const handleLocationChange = (index, field, value) => {
    const updatedLocations = [...locations];
    updatedLocations[index][field] = value;
    setLocations(updatedLocations);

  };
  useEffect(() => {

    if (isUpdated) {

      const timeoutId = setTimeout(() => {
        setIsUpdated(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [isUpdated]);


  const handleLocationAdd = async () => {
    const formData = { location: place, days: isDays }
    setIsPost(true)
    try {
      const resp = await axios.post(`${process.env.REACT_APP_BASE_URL}/post-locations`, formData)
      setplace('')
      isSetDays('')
      setIsPost(false)
      return resp.data
    } catch (error) {
      setIsPost(false)
      return error
    }
  }

  const handleLocationUpdate = async (id) => {
    const locationToUpdate = locations.find((loc) => loc._id === id);
    if (locationToUpdate) {
      setIsPost(true)
      try {
        const resp = await axios.put(`${process.env.REACT_APP_BASE_URL}/update-location/${id}`, locationToUpdate)
        setIsPost(false)
        setIsUpdated(true)
        return resp.data

      } catch (error) {
        setIsPost(false)
        return error
      }

    }
  }
  const handleLocationDelete = async (id) => {
    setIsPost(true)
    try {
      const resp = await axios.delete(`${process.env.REACT_APP_BASE_URL}/delete-location/${id}`)
      setIsPost(false)
      return resp.data
    } catch (error) {
      setIsPost(false)
      return error
    }

  }

  const getLocations = async () => {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/get-locations`)
      setLocations(resp.data)
      setData(resp.data)
    } catch (error) {
      return error
    }
  }


  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Check if the input contains only letters and a hyphen
    if (/^\d+(-\d*)?$/.test(inputValue) || inputValue === '-') {
      isSetDays(inputValue);
    }
  };


  useEffect(() => {
    getLocations()
  }, [])
  useEffect(() => {
    getLocations()
  }, [isPost])


  return (
    <div className='single'>
      <Sidebar />
      <div className='singleContainer'>
        <Navbar />
        <Wrapper>
          <div className='main-div' style={{ paddingBottom: '1.5rem' }}>
            <h3>Delivery locations</h3><br></br>
            <div className='input-div' style={{ marginBottom: '4rem' }}>
              <TextField id="outlined-required" label="Add location" value={place} onChange={(e) => setplace(e.target.value)}
                Small InputLabelProps={{ style: { lineHeight: '0.75' }, }}
                InputProps={{
                  style: {
                    maxWidth: '550px',
                    minWidth: '365px',
                    borderColor: 'blue',
                    backgroundColor: 'white',
                    height: '40px',
                    padding: '0px',
                    fontSize: '13px',

                  },
                }}
              />
              <div className='days-div'>
                <p>Delivered with in</p>
                <TextField
                  value={isDays}
                  onChange={handleInputChange}
                  label="Enter number - number"
                  InputLabelProps={{ style: { lineHeight: '0.75' } }}
                  InputProps={{
                    style: {
                      minWidth: '200px',
                      borderColor: 'blue',
                      backgroundColor: 'white',
                      height: '40px',
                      padding: '0px',
                      fontSize: '13px',
                    },
                  }}
                />
                <p>days.</p></div>
              <button onClick={handleLocationAdd} className='btn' style={{ margin: 0 }}>Add</button>
            </div>
            <div className='update-delete-div'>
              <div className='header'><h3>Update Delivery locations</h3> {isUpdated && <p className='warning'> Updated successfully...</p>}</div><br></br>
              {/* <div>
      {locations && locations.map((loc, index) => (
        <div key={index} className='input-div'>
          <TextField
            id={`location-${index}`}
            label="Location"
            placeholder={loc.location}
            value={loc.location}
            onChange={(e) => handleLocationChange(index, 'location', e.target.value)}
            variant="outlined"
          />
          <TextField
            id={`days-${index}`}
            label="Days"
            placeholder={loc.days.toString()}
            value={loc.days}
            onChange={(e) => handleLocationChange(index, 'days', e.target.value)}
            variant="outlined"
          />
        </div>
      ))}
    </div> */}
              {locations && locations.map((loc, idx) => {
                const { location, days } = loc

                return (
                  <div className='input-div-main'>
                    <div className='input-div'>


                      <TextField
                        id={`location-${idx}`}
                        label="Location"
                        placeholder={loc.location}
                        value={loc.location}
                        onChange={(e) => handleLocationChange(idx, 'location', e.target.value)}
                        Small InputLabelProps={{ style: { lineHeight: '0.75' }, }}
                        InputProps={{
                          style: {
                            maxWidth: '550px',
                            minWidth: '365px',
                            borderColor: 'blue',
                            backgroundColor: 'white',
                            height: '40px',
                            padding: '0px',
                            fontSize: '13px',
                          },
                        }}
                      />

                      <div className='days-div'>
                        <p>Delivered with in</p>
                        <TextField id={`days-${idx}`}
                          label="Days"
                          placeholder={loc.days.toString()}
                          value={loc.days}
                          onChange={(e) => handleLocationChange(idx, 'days', e.target.value)}
                          InputLabelProps={{ style: { lineHeight: '0.75' }, }} InputProps={{

                            style: {
                              minWidth: '70px',
                              borderColor: 'blue',
                              backgroundColor: 'white',
                              height: '40px',
                              padding: '0px',
                              fontSize: '13px',

                            },
                          }} />
                        <p>days.</p></div>

                      <button onClick={() => handleLocationUpdate(loc._id)} className='btn ' style={{ margin: 0 }}>Update</button>
                      <button onClick={() => handleLocationDelete(loc._id)} className='delete-btn' style={{ margin: 0 }}><FontAwesomeIcon icon={faTrash} /></button>
                      {/* {isUpdated  && <img src={tick} alt='sucess' />} */}
                    </div>   </div>)
              })}
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  )
}

export default Locations

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