import React, { useState, useEffect } from 'react';
import { Grid, TextField, Box, Paper, MenuItem, Button } from '@mui/material';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import Select from 'react-select';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import "./Pot.css";
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {

    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
} from '@mui/material';
import PotDetails from './demo';
import UpdatePotForm from './demo';
const Pot = () => {
    // Currency List
    const currencies = [
        {
            value: 'USD',
            label: '$',
        },
        {
            value: 'EUR',
            label: '€',
        },
        {
            value: 'BTC',
            label: '฿',
        },
        {
            value: 'JPY',
            label: '¥',
        },
    ];


    //pot length
    const [lengthPrice, setLengthPrice] = useState([]);
    const [selectedPots, setSelectedPots] = useState([]);
    const [price, setPrice] = useState('');
    const [Addname, setAddname] = useState('');
    const [lengthTags, setLengthTags] = useState([]);
    const [openDialog2, setOpenDialog2] = useState(false);


    const handlePotChange = (selectedOptions) => {
        // Extract the length and price from the selected options
        const selectedPotsData = selectedOptions.map(option => ({
            length: option.value.split(" - Price: ")[0], // Extract length from value
            price: option.value.split(" - Price: ")[1], // Extract price from value
        }));
        setSelectedPots(selectedOptions); // Set the selected options to state
        setLengthPrice(selectedPotsData); // Set the constructed lengthPrice array
    };

    const handleADDNameChange = (event) => {
        setAddname(event.target.value);
    };

    const handleADDPriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleLengthSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            name: Addname,
            price: parseFloat(price),
            currency: SelectedCurrency,
        };

        try {
            // Send a POST request to the server
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/listAllPots/addpotLengthTag`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // If the request was successful, reset the form fields
                setAddname('');
                setPrice('');
                setSelectedPots([]);
                setMessage('Length tag added successfully');
            } else {
                // Handle errors or show an error message
                setMessage('Error adding length tag');
            }
        } catch (error) {
            // Handle network or unexpected errors
            setMessage(error);
        }
        fetchLengthTags();
    };

    const handleOpenDialog2 = () => {
        setOpenDialog2(true);
    };

    const handleCloseDialog2 = () => {
        setOpenDialog2(false);
    };

    useEffect(() => {
        // Fetch length tags from the server when the component mounts
        fetchLengthTags();
    }, []);

    const fetchLengthTags = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getpotLengthTags`); // Replace with your server's endpoint

            if (response.ok) {
                const data = await response.json();
                setLengthTags(data);
            } else {
                // Handle errors or show an error message
                console.error('Error fetching length tags');
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error('Error fetching length tags:', error);
        }
    };

    // Function to handle editing an image
    const handleEditImage = (index) => {

        console.log(`Edit image at index ${index}`);
    };

    // Function to handle deleting an image
    const handleDeleteImage = (index) => {

        const updatedImages = [...editedImages];
        updatedImages.splice(index, 1);
        setEditedImages(updatedImages);
    };

    //Updation of Pot

    const [isDialogOpen, setDialogOpen] = useState(false);

    // State variables for edited pot data
    const [editedPotName, setEditedPotName] = useState('');
    const [editedPotPrice, setEditedPotPrice] = useState('');
    const [editedPotStock, setEditedPotStock] = useState('');
    const [editedCurrency, setEditedCurrency] = useState('');
    const [editedImages, setEditedImages] = useState([]);
    const [editedPotlength, setEditedPotLength] = useState([]);
    const handleUpdateClick = () => {
        // Set the edited data to match the selected pot's data
        setEditedPotName(potData.name);
        setEditedPotPrice(potData.price);
        setEditedCurrency(potData.Currency);
        setEditedPotStock(potData.potstock)
        setEditedPotLength(potData.lengthPrice)
        setEditedImages(potImages);

        // Open the dialog
        setDialogOpen(true);
        console.log("Dialog opened"); // Add this line for debugging
    };


    // Function to handle form input changes (name, price, currency, and images)
    const handleNameChange = (event) => {
        setEditedPotName(event.target.value);
    };

    const handlePriceChange = (event) => {
        setEditedPotPrice(event.target.value);
    };

    const handlePotStockChange = (event) => {
        setEditedPotStock(event.target.value);
    };

    const handleCurrencyChange = (event) => {
        setEditedCurrency(event.target.value);
    };

    // Function to submit the updated data to the server
    const handleUpdateSubmit = async () => {
        // Prepare the updated data object
        const updatedPotData = {
            name: editedPotName,
            price: editedPotPrice,
            Currency: editedCurrency,
            potstock: editedPotStock,

            image: editedImages,
        };

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', updatedPotData.name); // Updated name
            formDataToSend.append('price', updatedPotData.price); // Updated price
            formDataToSend.append('Currency', updatedPotData.Currency);
            formDataToSend.append('potstock', updatedPotData.potstock);// Updated potstock
            // Append image if needed
            if (updatedPotData.image) {
                formDataToSend.append('image', updatedPotData.image);
            }

            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/updatePot/${potData.name}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);

            // Fetch the updated data after the update
            await fetchPotDetails(potData.name);

            await fetchPots();
            setMessage('Updated Successfully');
            setDialogOpen(false);
        } catch (error) {
            console.error(error);
        }
    };



    //feching image handler
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % potImages.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + potImages.length) % potImages.length);
    };

    // Fetching Pot Details
    const [PotNames, setPotNames] = useState([]);
    const [selectedPot, setSelectedPot] = useState('');
    const [potData, setPotData] = useState({
        name: '',
        price: '',
        Currency: '',
        potstock: '',
        lengthPrice: [],
    });

    // Add a state variable to store images related to the selected pot name
    const [potImages, setPotImages] = useState([]);

    const fetchPots = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/listAllPots`);
            setPotNames(response.data);
        } catch (error) {
            console.error('Error fetching Pot names:', error);
        }
    };

    const fetchPotDetails = async (potName) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getPot/${potName}`);
            setPotData(response.data);
        } catch (error) {
            console.error(`Error fetching Pot data for ${potName}:`, error);
        }
    };


    useEffect(() => {
        fetchPots();
    }, []);

    useEffect(() => {
        if (selectedPot) {
            fetchPotDetails(selectedPot);

        } else {
            setPotData({
                name: '',
                price: '',
                Currency: '',
                potstock: '',
                lengthPrice: [],
            });
            setPotImages([]); // Clear the images when no pot name is selected
        }
    }, [selectedPot]);

    // File Upload
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [PotName, setPotName] = useState('');
    const [PotPrice, setPotPrice] = useState('');
    const [potstock, setPotstock] = useState('');
    const [SelectedCurrency, setSelectedCurrency] = useState('');
    const [message, setMessage] = useState('');

    const onDrop = (acceptedFiles) => {
        setSelectedFiles([...selectedFiles, ...acceptedFiles]);
    };

    const handleFileInputChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...newFiles]);
    };

    const removeFile = (file) => {
        const updatedFiles = selectedFiles.filter((f) => f !== file);
        setSelectedFiles(updatedFiles);
    };


    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          width: '70%',
          minWidth: '320px',
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
          width: '100%',
          maxWidth: '100%', 
          minWidth: '200px',
          zIndex:999,
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




    // Pot insertion
    const handleCategorySelect = (currencyName) => {
        setSelectedCurrency(currencyName);
    };
    const selectedPotsNames = selectedPots.map((pots) => pots.value);
    const uploadFiles = async () => {
        try {
            // Check if PotName, PotPrice, and SelectedCurrency are not empty
            if (!PotName) {
                setMessage('Please fill PotName.');
                return;
            }

            // Check if PotPrice is a valid number
            // if (isNaN(PotPrice)) {
            //     setMessage('Please enter a valid number for the price.');
            //     return;
            // }

            // Check if PotName already exists
            if (PotNames.some((option) => option.name === PotName)) {
                setMessage('Pot name already exists. Please choose a different name.');
                return;
            }

            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('photos', file);
            });

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addPot`, formData, {
                params: {
                    name: PotName,
                    price: PotPrice,
                    Currency: SelectedCurrency,
                    potstock: potstock,
                    lengthPrice: lengthPrice,
                },
            });

            setPotName('');
            setPotPrice('');
            setSelectedCurrency('');
            setPotstock('');
            setMessage('Files uploaded successfully');

            console.log(response.data);

            // Fetch the updated list of Pots after successful upload
            fetchPots();
        } catch (error) {
            setMessage('Error uploading files: ' + error.message);
        }
    };


    const handleDropdownChange = (event) => {
        const selectedPlantcareName = event.target.value;
        setSelectedPot(selectedPlantcareName);
    };

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="MainContainer">
                    
                    <div className='main-container'>
                        {/* First Column */}
                        <div>
                        <h3>Pot Add & Edit Here</h3>
                        </div>
                        <div className='first-box'>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    '& > :not(style)': {
                                        m: 1,
                                        width:' 100%',
                                        height:'fit-content',
                                    },
                                }}
                            >

                               
                                <div><h4>Add New pot</h4></div>
                                    <div className="paper1">
                                    
                                        <div className='form'>
                                            <span>Pot Name</span>
                                            <TextField
                                                color="success"
                                                value={PotName}
                                                onChange={(e) => setPotName(e.target.value)}
                                                placeholder='Pot Name'
                                                style={{
                                                    width: '73%',
                                                    borderColor: 'red',
                                                  }}
                                            />
                                        </div>



                                        <div style={{ paddingBottom: '30px', paddingTop: '30px',marginLeft:'20px' }} className='form'>
                                            <span>Pot Length</span>
                                            <Select
                                                isMulti
                                                options={lengthTags.map((option) => ({
                                                    value: `${option.name} - Price: ${option.price}`, // Use only the name as the value
                                                    label: `${option.name} - Price: ${option.price}`,
                                                }))}
                                                value={selectedPots}
                                                onChange={(selectedOptions) => {
                                                    handlePotChange(selectedOptions);
                                                }}
                                                styles={customStyles}
                                            />


                                            <IconButton onClick={handleOpenDialog2} style={{ borderRadius: '50%' }}>
                                                <AddIcon style={{ color: 'black' }} />
                                            </IconButton>
                                        </div>

                                        <div >
                                            <Button
                                                variant="contained"
                                                onClick={uploadFiles}
                                                className='btn-add'
                                                sx={{
                                                    mt: 1,
                                                    mr: 1,
                                                    backgroundColor: '#4D995D',
                                                    '&:hover': { backgroundColor: '#4D995D' },
                                                }}
                                            >
                                                Submit
                                            </Button>
                                            <div style={{ paddingTop: '10px' }}>
                                                <p className="message">{message}</p>
                                            </div>
                                        </div>
                                    </div>
                              
                            </Box>
                        </div>
                        {/* Second Column */}
                        <div className='second-box'>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    '& > :not(style)': {
                                        m: 1,
                                        width:'100%',
                                        height:'fit-content',
                                    },
                                }}
                            >
                             
                                    <div className="paper3">
                                        <h4>Update Pot Details</h4>

                                        <UpdatePotForm />
                                    </div>

                                    <div className="paper1">

                                        {/* Add ADD LENGTH Dialog */}
                                        <Dialog open={openDialog2} onClose={handleCloseDialog2}>
                                            <DialogTitle>Add New Length</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    label="New Length"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={Addname} onChange={handleADDNameChange}
                                                />

                                                <TextField
                                                    label="New Price"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={price} onChange={handleADDPriceChange}
                                                />


                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleCloseDialog2}>Cancel</Button>
                                                <Button onClick={handleLengthSubmit} color="primary">
                                                    Submit
                                                </Button>
                                            </DialogActions>
                                        </Dialog>


                                    </div>
                                


                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pot;
