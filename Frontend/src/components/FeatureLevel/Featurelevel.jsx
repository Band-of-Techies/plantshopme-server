import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Box = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// ... (other imports)

const Featurelevel = () => {
    const [featureLevels, setFeatureLevels] = useState([]);
  
    const fetchFeatureLevels = () => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/getFeatures`)
        .then((response) => {
          const uniqueFeatureLevels = response.data.map((feature) => ({
            _id: feature._id,
            name: feature.name,
            level: feature.level,
            isEditing: false,  // Set isEditing to false initially
          }));
  
          setFeatureLevels(uniqueFeatureLevels);
        })
        .catch((error) => {
          console.error('Error fetching feature levels:', error);
        });
    };
  
    useEffect(() => {
      fetchFeatureLevels();
    }, []);
  
    const handleLevelUpdate = async (_id) => {
      try {
        const featureToUpdate = featureLevels.find((feature) => feature._id === _id);
        await axios.put(`${process.env.REACT_APP_BASE_URL}/updateFeatureLevel/${_id}`, { level: featureToUpdate.level });
        fetchFeatureLevels(); // Refresh feature levels after updating
        toast.success('Feature level updated successfully!');
      } catch (error) {
        console.error('Error updating feature level:', error);
        toast.error('Failed to update feature level.');
      }
    };
  
    const handleEditToggle = (index) => {
      const updatedLevels = [...featureLevels];
      updatedLevels[index].isEditing = !updatedLevels[index].isEditing;
      setFeatureLevels(updatedLevels);
    };
  
    return (
        <div className='single'>
        <Sidebar />
        <div className='singleContainer'>
          <Navbar />
        <Wrapper>
          <div>
          {featureLevels.map(({ _id, name, level, isEditing }, index) => (
  <Box key={_id} style={{ marginBottom: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ flex: '1' }}>
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{name}</div>

      {isEditing ? (
        <TextField
          type="number"
          size="small"
          label="New Level"
          variant="outlined"
          value={level}
          onChange={(e) => setFeatureLevels((prevLevels) => prevLevels.map((prevLevel, i) => (i === index ? { ...prevLevel, level: e.target.value } : prevLevel)))}
          style={{ marginTop: '8px' }}
        />
      ) : (
        <div style={{ marginTop: '8px' }}>{`Level: ${level}`}</div>
      )}
    </div>

    <div style={{ marginLeft: '10px' }}>
      <Button variant="outlined" color="primary" onClick={() => handleEditToggle(index)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>

      {isEditing && (
        <Button variant="outlined" color="primary" onClick={() => handleLevelUpdate(_id)}>
          Update
        </Button>
      )}
    </div>
  </Box>
))}

          </div>
          <ToastContainer />
        </Wrapper>
      </div></div>
    );
  };
  
  export default Featurelevel;
  

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