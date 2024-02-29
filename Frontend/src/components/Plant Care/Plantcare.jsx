import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Grid } from '@mui/material';
import '../Category/single.scss';


const steps = [
  {
    label: 'Care Name',
  },
  {
    label: 'Image',
  },
  {
    label: 'Description',
  },
];

function PlantcareForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [plantcareNames, setPlantcareNames] = useState([]);

  // Store form data in React state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo: null,
  });

 

 

  // Store the uploaded image in a temporary variable
  const [tempImage, setTempImage] = useState(null);

  // Store the selected PlantCare data
  const [selectedPlantcare, setSelectedPlantcare] = useState('');
  const [plantcareData, setPlantcareData] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    // Make a GET request to fetch the PlantCare names
    fetchCareNames();
  }, []);

  const fetchCareNames = async () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/getPlantcareNames`)
      .then((response) => {
        // Set the received names in the state
        setPlantcareNames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching PlantCare names:', error);
      });
  }

  useEffect(() => {
    if (selectedPlantcare) {
      // Make a GET request to fetch PlantCare data by name
      axios.get(`${process.env.REACT_APP_BASE_URL}/getPlantcare/${selectedPlantcare}`)
        .then((response) => {
          // Set the received PlantCare data in the state
          setPlantcareData(response.data);
        })
        .catch((error) => {
          console.error(`Error fetching PlantCare data for ${selectedPlantcare}:`, error);
        });
    } else {
      // Clear the PlantCare data when nothing is selected
      setPlantcareData({
        name: '',
        description: '',
        image: '',
      });
    }
  }, [selectedPlantcare]);

  const handleDropdownChange = (event) => {
    const selectedPlantcareName = event.target.value;
    setSelectedPlantcare(selectedPlantcareName);

    // Find the corresponding PlantCare by name and set its data in plantcareData
    const selectedPlantcareItem = plantcareNames.find((plantcare) => plantcare.name === selectedPlantcareName);
    
    if (selectedPlantcareItem) {
      setPlantcareData({
        _id: selectedPlantcareItem._id, // Set the _id field
        name: selectedPlantcareItem.name,
        description: selectedPlantcareItem.description,
        image: selectedPlantcareItem.image,
      });
    }
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedImage(URL.createObjectURL(selectedFile)); // Update the image preview

    // Update the image data in plantcareData
    setPlantcareData({
      ...plantcareData,
      image: selectedFile,
    });
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', plantcareData.name);
      formDataToSend.append('description', plantcareData.description);
      if (plantcareData.image) {
        formDataToSend.append('image', plantcareData.image);
      }

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/updatePlantcare/${plantcareData.name}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);

      // Reset the form and stepper
      handleReset();
    } catch (error) {
      console.error(error);
    }
  };




  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    // Reset the form data
    setFormData({
      name: '',
      description: '',
      photo: null,
    });
    // Restore the uploaded image from the temporary variable
    setTempImage(null);
  };

  const handleChange = (event) => {
    // Update form data in state as the user enters data
    const { id, value, files } = event.target;
    if (id === 'photo') {
      setFormData((prevData) => ({
        ...prevData,
        [id]: files[0],
      }));
      // Store the uploaded image in the temporary variable
      setTempImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const clickHandler = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', formData.photo);

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addPlantcare`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);

      // Reset the form and stepper
      handleReset();
    } catch (error) {
      console.error(error);
    }
    fetchCareNames();
  };

  return (
    <div className='single'>
      <Sidebar></Sidebar>
      <div className='singleContainer'>
        <Navbar />
        <Grid container spacing={2} style={{
          paddingTop: "70px",
          backgroundColor:'#F5F7F8',
          height:'93%',
          paddingLeft: "50px",
          paddingRight: "50px", // Add right padding for balance
          marginLeft: "auto", // Center the container horizontally
          marginRight: "auto", // Center the container horizontally
          maxWidth: "100%", // Ensure the container doesn't exceed the viewport width
        }}>
          {/* First Column */}

          <Grid item xs={12} sm={6} md={6} >
            <Paper elevation={3}>
              <div>
                <Box sx={{ maxWidth: 200 }} style={{ width: 400, height: 400, paddingTop: '10px', padddingLeft: '10px', overflowY: 'auto', maxHeight: '630px' ,maxWidth:'630px'}}>
                  <Stepper activeStep={activeStep} orientation="vertical" style={{paddingLeft:'20px'}}>
                    {steps.map((step, index) => (
                      <Step key={step.label} >
                         <StepLabel className="custom-step-label" style={{ color: 'success' }}>{step.label}</StepLabel>
                        <StepContent >
                          <Typography >{step.label === 'Care Name' ? ' ' : step.label === 'Image' ? 'Upload Photo' : ' '}</Typography>
                          <div  >
                            {step.label === 'Care Name' && (
                              <TextField
                                id="name"
                                label="Name"
                                variant="outlined"
                                color="success"

                                value={formData.name}
                                onChange={handleChange}
                              />
                            )}
                            {step.label === 'Image' && (
                              <div>
                                <input
                                  type="file"
                                  id="photo"
                                  accept="image/*"
                                  onChange={handleChange}
                                  color="success"
                                />
                                {tempImage && (
                                  <img src={tempImage} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />
                                )}
                              </div>
                            )}
                            {step.label === 'Description' && (
                              <TextField
                                id="description"
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                color="success"
                              />
                            )}
                          </div>
                          <Box sx={{ mb: 2 }} >
                            <div>
                              {index === steps.length - 1 ? (
                                <Button
                                  variant="contained"
                                  onClick={clickHandler}
                                  sx={{ mt: 1, mr: 1, backgroundColor: '#66BF84', '&:hover': { backgroundColor: '#4D995D' } }}
                                >
                                  Submit
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ mt: 1, mr: 1, backgroundColor: '#66BF84', '&:hover': { backgroundColor: '#4D995D' } }}
                                >
                                  Continue
                                </Button>
                              )}
                              <IconButton
                                disabled={index === 0}
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1, backgroundColor: '#66BF84' }}
                                color="primary" // Change the color as needed
                              >
                                <ArrowBackIcon />
                              </IconButton>

                            </div>
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                      <Typography>All steps completed - you&apos;re finished</Typography>
                      <Button onClick={handleReset} sx={{ mt: 1, mr: 1, backgroundColor: '#66BF84', '&:hover': { backgroundColor: '#4D995D' } }}>
                        Reset
                      </Button>
                    </Paper>
                  )}
                </Box>
              </div>
            </Paper>
          </Grid>

          {/* second Column */}
          <Grid item xs={12} sm={12} md={6} lg={4} >

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Paper elevation={3}>
                <div> 
                  <Box style={{ width: 400, height: 400, paddingTop: '15px', paddingLeft: '25px',overflowY: 'auto', maxHeight: '630px' }}>
                  <label style={{paddingTop:'20px'}}>Select Care:</label>
                  <select value={selectedPlantcare} onChange={handleDropdownChange} >
                    <option value="">Select an option</option>
                    {plantcareNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>

                  {selectedPlantcare && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={selectedImage || plantcareData.image}
                          alt="plantcare"
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                          }}
                        />
                        <h2 style={{ marginLeft: '10px' }}>{plantcareData.name}</h2>
                      </div>
                      <div>
                        <label htmlFor="upload-button">
                          <Button
                            variant="contained"
                            color="primary"
                            component="label"
                            sx={{ mt: 1, mr: 1, backgroundColor: '#66BF84', '&:hover': { backgroundColor: '#4D995D' } }}
                          >
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              id="upload-button"
                              style={{ display: 'none' }}
                              onChange={handleImageChange}
                            />
                          </Button>
                        </label>
                        <div>
                          <label>Description:</label>
                          <textarea
                            id="description"
                            value={plantcareData.description}
                            onChange={(e) => setPlantcareData({ ...plantcareData, description: e.target.value })}
                            rows={10}
                            cols={25}
                          />
                        </div>

                        <Button variant="contained" sx={{ mt: 1, mr: 1, backgroundColor: '#66BF84', '&:hover': { backgroundColor: '#4D995D' } }} onClick={handleUpdate}>Edit</Button>

                      </div>



                    </div>

                  )}

                </Box>
                </div>
              </Paper>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default PlantcareForm;