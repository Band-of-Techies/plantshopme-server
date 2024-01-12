import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Measures = () => {
  const Dim = [
    {
      value: 'Dimension',
      label: 'Dimension',
    },
    {
      value: 'Size',
      label: 'Size',
    },
    {
      value: 'Dimensions & Color',
      label: 'Dimensions & Color',
    },
  ];

  const [selectedCategoryDim, setselectedCategoryDim] = useState('');
  const [selectedimension, setSelectedDimension] = useState('');
  const [dimensionOptions, setDimensionOptions] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputValuedi, setInputValuedi] = useState('');
  const [inputValuePrice, setInputValuePrice] = useState('');
  const [dataList, setDataList] = useState([]);

  const fetchDimensions = async (category) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getDimensionTags/${category}`);
      const dimensionTags = response.data;
      setDimensionOptions(dimensionTags);
    } catch (error) {
      console.error('Error fetching Dimensions:', error);
    }
  };

  useEffect(() => {
    if (selectedCategoryDim) {
      fetchDimensions(selectedCategoryDim);
    }
  }, [selectedCategoryDim]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAddButtonClick = () => {
    handleDialogOpen();
  };

  const handleAddOption = async () => {
    try {
      // Perform the logic to add the new option with dimension and status
      await axios.post(`${process.env.REACT_APP_BASE_URL}/addDimensionTag`, {
        name: inputValue,  // Using inputValue as the dimension value
        Status: selectedCategoryDim,  // Using selectedCategoryDim as the status value
      });
  
      // Close the dialog
      handleDialogClose();
  
      // Optionally, you can fetch the updated dimensions after adding a new one
      if (selectedCategoryDim) {
        fetchDimensions(selectedCategoryDim);
      }
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  const handleAddToList = () => {
    // Add the entered data to the list
    setDataList(prevList => [...prevList, { Value: inputValue, Status: selectedimension, Price: inputValuePrice }]);
    
    // Clear the input fields
    setInputValue('');
    setInputValuedi('');
    setInputValuePrice('');
    setSelectedDimension('');
  };

  const handleDeleteItem = (index) => {
    // Remove the item at the specified index from the list
    setDataList(prevList => prevList.filter((_, i) => i !== index));
  };

  const handleSubmitDim = async () => {
    try {
      // Iterate through each set of data and insert into the database
      for (const item of dataList) {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/selectedDimensionsDetails`, {
          Status: item.Status,
          Value: item.Value,
          Price: item.Price,
          productName:'ASD',
          subCategory:'',
          category:'',
          mainCategory:'',
        });
      }

      // Optionally, you can perform additional actions after submitting
      // ...

      // Clear the list of added items
      setDataList([]);
    } catch (error) {
      console.error('Error submitting details:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '20px' }}>
          <span>Care Type</span>
          <TextField
            id="outlined-select-category"
            select
            style={{ minWidth: '150px' }}
            color="success"
            onChange={(e) => setselectedCategoryDim(e.target.value)}
          >
            {Dim.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {dimensionOptions.length > 0 && (
          <div>
            <span>Dimensions based on Status:</span>
            <TextField
              id="outlined-select-dimensions"
              select
              style={{ minWidth: '150px' }}
              color="success"
              onChange={(e) => setSelectedDimension(e.target.value)}
            >
              {dimensionOptions.map((dimension) => (
                <MenuItem key={dimension._id} value={dimension.Dimension}>
                  {dimension.Dimension}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}

        <TextField
          label="Price"
          value={inputValuePrice}
          onChange={(e) => setInputValuePrice(e.target.value)}
          fullWidth
        />

        <TextField
          label="Value"
          value={inputValuedi}
          onChange={(e) => setInputValuedi(e.target.value)}
          fullWidth
        />

        <Button onClick={handleAddToList} color="primary">
          Add to List
        </Button>

        {/* Your 'Add' button can trigger the modal or other actions */}
        <button onClick={handleAddButtonClick}>Add</button>
      </div>

      {/* Dialog for adding new option */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Option</DialogTitle>
        <DialogContent>
          <TextField
            label="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
          />
          
          <TextField
            label="Category"
            select
            value={selectedCategoryDim}
            onChange={(e) => setselectedCategoryDim(e.target.value)}
            fullWidth
          >
            {Dim.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {/* Use the 'Submit' button to submit the details */}
          <Button onClick={handleAddOption} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display the list of added items */}
      {dataList.map((item, index) => (
        <div key={index} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
          <p>{`Value: ${item.Value}, Status: ${item.Status}, Price: ${item.Price}`}</p>
          <Button onClick={() => handleDeleteItem(index)} color="secondary">
            Delete
          </Button>
        </div>
      ))}

      {/* Submit button */}
      <Button onClick={handleSubmitDim} color="primary">
        Submit
      </Button>
    </div>
  );
};

export default Measures;
