import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from 'react-select';

const UpdatePotForm = () => {
    const [potData, setPotData] = useState({
        name: '',
        price: '',
        Currency: '',
        potstock: '',
        lengthPrice: [],
    });



    

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          width: '40%',
          minWidth: '315px',
          maxWidth: '100%',
          minHeight: '55px', 
          height: 40,
          borderRadius: 5,
          borderColor: '#d9e2ec',
          boxShadow: state.isFocused ? '0 0 0 1px #d9e2ec' : null,
          "&:hover": {
            borderColor: '#d9e2ec',
          },
          marginLeft: '0',
          marginRight: '12px',
        }),
        input: (provided) => ({
          ...provided,
          readOnly: 'true',
        }),
        option: (provided, state) => ({
          ...provided,
          fontSize: 14,
          textAlign: 'left',
          padding: '8px',
          backgroundColor: state.isDisabled
            ? null
            : state.isSelected
            ? '#66bf84'
            : state.isFocused
            ? '#e2fee2'
            : null,
          "&:active": {
            backgroundColor: '#66bf84',
          },
          outline: state.isFocused ? 'none' : null,
        }),
        menu: (provided) => ({
          ...provided,
          width: '48%',
          maxWidth: '50%', 
          minWidth: '200px',
          marginLeft:'0.5rem',
          marginRight:'0.5rem',
          zIndex: 9999, 
        }),
        placeholder: (provided) => ({
          ...provided,
          textAlign: 'left',
        }),
        singleValue: (provided) => ({
          ...provided,
          textAlign: 'left',
          fontSize: 13,
        }),
      };



    const [potNames, setPotNames] = useState([]);
    const [selectedPot, setSelectedPot] = useState('');

    const handleChange = (e) => {
        setPotData({
            ...potData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLengthPriceChange = (index, property, value) => {
        const updatedLengthPrice = [...potData.lengthPrice];
        updatedLengthPrice[index][property] = value;

        setPotData({
            ...potData,
            lengthPrice: updatedLengthPrice,
        });
    };

    const handleAddLengthPrice = () => {
        setPotData({
            ...potData,
            lengthPrice: [...potData.lengthPrice, { length: '', price: '' }],
        });
    };

    const handleDeleteLengthPrice = (index) => {
        const updatedLengthPrice = [...potData.lengthPrice];
        updatedLengthPrice.splice(index, 1);

        setPotData({
            ...potData,
            lengthPrice: updatedLengthPrice,
        });
    };

    const handleUpdate = async () => {
        try {
            // Make a PUT request to update the pot details
            await axios.put(`${process.env.REACT_APP_BASE_URL}/updatePot/${potData.name}`, potData);

            // Optional: Fetch updated data after successful update
            // const response = await axios.get(`http://localhost:5000/api/getPot/${potData.name}`);
            // setPotData(response.data);

            console.log('Pot updated successfully!');
        } catch (error) {
            console.error('Error updating pot:', error);
        }
    };

    const handlePotSelection = async (selectedPot) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getPot/${selectedPot}`);
            setPotData(response.data);
        } catch (error) {
            console.error(`Error fetching pot details for ${selectedPot}:`, error);
        }
    };

    useEffect(() => {
        // Fetch all pot names on component mount
        const fetchPotNames = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/listAllPots`);
                setPotNames(response.data.map((pot) => pot.name));
            } catch (error) {
                console.error('Error fetching pot names:', error);
            }
        };

        fetchPotNames();
    }, []);







    return (
        <div className='pot-container'>
            <div className='container-input'>
                {/* <Select
                    label="Select Pot"
                    value={selectedPot}
                    onChange={(e) => {
                        setSelectedPot(e.target.value);
                        handlePotSelection(e.target.value);
                    }}
                    style={customStyles} 
                >
                    {potNames.map((potName) => (
                        <MenuItem key={potName} value={potName}>
                            {potName}
                        </MenuItem>
                    ))}
                </Select> */}
                <div className='select-box'>
                <p>Select  Pot</p>
                <Select label="Select Pot" value={{ label: selectedPot, value: selectedPot }} onChange={(selectedOption) => {
                      setSelectedPot(selectedOption.value);
                       handlePotSelection(selectedOption.value); }}
                       styles={customStyles}  options={potNames.map((potName) => ({ label: potName, value: potName }))}/>
                </div>
            
            {/* 
      <TextField
        label="Pot Name"
        fullWidth
        name="name"
        value={potData.name}
        onChange={handleChange}
        disabled // Pot name should not be editable
      /> */} <div className='select-box'>
         <p>Pot Stock</p>
            <TextField
                label="Pot Stock"
              
                name="potstock"
                value={potData.potstock}
                onChange={handleChange}
                style={{ minWidth: '320px', fontSize: '16px' }}
            /></div>
            </div>
            <div  className='existing-pot'>
                {potData.name ? potData.lengthPrice.map((item, index) => (
                    <div key={index} className='existing-pot-single'>
                        <div>
                        <TextField
                            label={`Length ${index + 1}`}
                           
                            value={item.length}
                            onChange={(e) => handleLengthPriceChange(index, 'length', e.target.value)}
                            style={{ minWidth: '400px', fontSize: '16px' }}
                        /></div>
                        <div >
                            <TextField
                                label={`Price ${index + 1}`}
                               
                                value={item.price}
                                onChange={(e) => handleLengthPriceChange(index, 'price', e.target.value)}
                                style={{ minWidth: '400px', fontSize: '16px' }}
                            /></div>
                        <div >
                            <button type='button'
                                
                                onClick={() => handleDeleteLengthPrice(index)}
                                className='delete-btn'
                            >
                                Delete <DeleteIcon />
                            </button></div>
                    </div>
                )) : <div className='select-warning'><p className='select-warning-p'>Select a pot to view</p></div>}
            </div>
            <div>
            <div className='upload-btns'>
                <button type='button' onClick={handleAddLengthPrice} className='upload-btn'>
                   <AddIcon /> Add Length & Price
                </button>
                <button type='button'  onClick={handleUpdate}  className='upload-btn'> Update Pot</button></div>
            </div>

        </div>
    );
};

export default UpdatePotForm;
