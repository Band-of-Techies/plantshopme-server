import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem } from '@mui/material';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
// import "../ProductAdd/AddProduct.css";
import InputAdornment from '@mui/material/InputAdornment';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';
import { MainWrapper, Wrapper } from './addProductWrapper';




const ProductAdd = () => {

    const [plantcareNames, setPlantcareNames] = useState([]);
    const [selectedPlantcare, setSelectedPlantcare] = useState('');
    const [plantcareData, setPlantcareData] = useState({
        name: '',
        description: '',
        image: '',
    });

    const [featureNames, setFeatureNames] = useState([]);
    const [featurenamesset, setFeatureNamesSet] = useState([]);
    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialog2, setOpenDialog2] = useState(false);
    const [newFeature, setNewFeature] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Make a GET request to fetch the PlantCare names
        axios.get(`${process.env.REACT_APP_BASE_URL}/getPlantcareNames`)
            .then((response) => {
                // Set the received names in the state
                setPlantcareNames(response.data);
            })
            .catch((error) => {
                console.error('Error fetching PlantCare names:', error);
            });

        // Call the function to fetch feature names initially
        fetchFeatureNames();
        //product Maincategory

        fetchCategories();
    }, []);

    const [selectedFeatures, setSelectedFeatures] = useState([]);



    const handleFeatureChange = (selectedOptions) => {
        setSelectedFeatures(selectedOptions);
    };
    // styles={{
                                            
    //     
    // }}
    //select style
    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          width: '100%',
          minWidth: '335px',
          maxWidth: '100%',
          minHeight: '53px', 
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



    // Function to fetch feature names
    const fetchFeatureNames = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/getFeatures`)
            .then((response) => {
                // Filter out duplicates and null values
                const uniqueFeatureNames = response.data
                    .filter((name, index, self) => self.indexOf(name) === index && name !== null);

                // Update the Set of feature names
                setFeatureNamesSet(new Set(uniqueFeatureNames));

                // Convert the Set to an array for rendering
                setFeatureNames([...uniqueFeatureNames]);
            })
            .catch((error) => {
                console.error('Error fetching feature names:', error);
            });
    };




    //******PRODUCT _POT********* */


    const [PotNames, setPotNames] = useState([]);
    const fetchPots = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/listAllPots`);
            setPotNames(response.data);
        } catch (error) {
            console.error('Error fetching Pot names:', error);
        }
    };

    useEffect(() => {
        fetchPots();
        fetchselectedcarename();
    }, []);




    ///********POT IMAGE HANDLING */



    //plant care***********

    const [textareaContent, setTextareaContent] = useState('');
    
    useEffect(() => {
        if (selectedPlantcare) {
            const initialDescription = selectedPlantcare.description;
            setTextareaContent(initialDescription);
        }
    }, [selectedPlantcare]);

    const handleTextareaChange = (e) => {
        setTextareaContent(e.target.value);
    };

    const handleDropdownChange = (event) => {
        const selectedPlantcareName = event.target.value;
        setSelectedPlantcare(selectedPlantcareName);

        // Make a GET request to fetch PlantCare data by name
        axios.get(`${process.env.REACT_APP_BASE_URL}/getPlantcare/${selectedPlantcareName}`)
            .then((response) => {
                // Set the received PlantCare data in the state
                setPlantcareData(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching PlantCare data for ${selectedPlantcareName}:`, error);
            });
    };



    const Carename = [
        {
            value: 'Seed Care',
            label: 'Seed Care',
        },
        {
            value: 'Plant Care',
            label: 'Plant Care',
        },

    ];

    //feature tag
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    //length
    const handleOpenDialog2 = () => {
        setOpenDialog2(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleCloseDialog2 = () => {
        setOpenDialog2(false);
    };

    const handleSubmit = () => {
        // Check if the new feature already exists in the list
        if (featureNames.some(feature => feature.name === newFeature)) {
            setMessage('Feature already exists.');

            return;
        }

        const dataToSend = {
            name: newFeature,
        };

        // Send a POST request to your server endpoint
        axios.post(`${process.env.REACT_APP_BASE_URL}/addFeature`, dataToSend)
            .then((response) => {

                setMessage('Feature added successfully');
                fetchFeatureNames();


                handleCloseDialog();
            })
            .catch((error) => {

                setMessage('Error adding feature: ' + error.message);
            });
    };

    //*********** */

    //plant care insertion **

    const [careName, setcareName] = useState('');
    const [careType, setCareType] = useState('');


    //Form FOR ADD PRODUCT

    //FILE UPLOAD


    const [selectedFiles, setSelectedFiles] = useState([]);
    const [productTitle, setProductTitle] = useState('');
    const [productprice, setProductPrice] = useState('');
    const[scientific,setProductscientic]=useState('')

    const [description, setdescription] = useState('');

    const onDrop = (acceptedFiles) => {
        // Handle the dropped files here
        setSelectedFiles([...selectedFiles, ...acceptedFiles]);
    };

    const handleFileInputChange = (e) => {
        // Handle file input change (browsing method)
        const newFiles = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...newFiles]);
    };

    const removeFile = (file) => {
        // Remove a file from the selectedFiles array
        const updatedFiles = selectedFiles.filter((f) => f !== file);
        setSelectedFiles(updatedFiles);
    };

    const handleTagInputChange = (selectedOptions) => {
        // Handle file input change (browsing method)
        // const newFiles = Array.from(selectedOptions);
        // setSelectedFeatures([...selectedFeatures, ...newFiles]);
    };








    //ADDING PRODUCT ***********   

    const uploadFiles = async () => {
        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('photos', file);
            });

            // Append the selected feature tags to the formData as an array
            // const selectedFeatureTags = selectedFeatures.map(tag => tag.value);
            // formData.append('FeatureTag', JSON.stringify(selectedFeatureTags));

            const selectedFeatureNames = selectedFeatures.map((feature) => feature.value);
            const selectedPotsNames = selectedPots.map((pots) => pots.value);
            const selectedLengthNames = selecteLengthDetails.map((len) => len.value)

            // Send a POST request to server endpoint to upload files
            await axios.post(`${process.env.REACT_APP_BASE_URL}/addProduct`, formData, {
                params: {
                    title: productTitle,
                    scienticName:scientific,
                    description: description,
                    maincategory: selectedCategory,
                    category: selectedsubCategory,
                    subcategory: selectedsubCategory2,
                    stock: productStock,
                    FeatureTag: selectedFeatureNames,
                    length: selectedLengthNames,
                    Pots: selectedPotsNames,
                    careName: plantcareData.name,
                    careType: careType,
                    caredes: plantcareData.description,
                    price: productprice,
                    currency: SelectedCurrency1,

                },
            });

            // Reset selected files and show success message
            setSelectedFeatures([]);
            setProductTitle('');
            setProductscientic('');
            setdescription('')
            setProductPrice('');
            setSelectedCategory('');
            setSelectedsubCategory('');
            setProductStock('');
            setSelectedTags(['']);
            setcareName('');
            setCareType('');
            setMessage('Files uploaded successfully');
            setSelectedFiles(['']);
            setSelectedPots(['']);
            setselecteLengthDetails(['']);
            setSelectedPlantcare(['']);
            

        } catch (error) {
            // Handle any errors and show an error message
            setMessage('Error uploading files: ' + error.message);
        }
    };


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*', // You can specify the accepted file types here
    });


    //*********** */

    {/*****PRODUCT CATEGORY*******/ }
    const [mainCategory, setMainCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedsubCategory, setSelectedsubCategory] = useState(null);
    const [selectedsubCategory2, setSelectedsubCategory2] = useState(null);

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
        fetchSubcategories(categoryName);
        fetchSubcategories2(categoryName);

    }

    const handlesubcategorySelect = (categoryName) => {

        fetchSubcategories2(categoryName);
        setSelectedsubCategory(categoryName)
    }

    const handlesubcategorySelect2 = (categoryName) => {

        // fetchSubcategories2(categoryName);
        setSelectedsubCategory2(categoryName)
    }
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getMainCategories`);
            if (response.ok) {
                const data = await response.json();
                setMainCategory(data);
            }
        } catch (error) {
            console.error('Error fetching Main categories:', error);
        }
    };

    const fetchSubcategories = async (selectedCategory) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getCategoriesByParent/${selectedCategory}`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories2 = async (selectedsubCategory) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getSubcategories/${selectedCategory}/${selectedsubCategory}`);
            if (response.ok) {
                const data = await response.json();
                setSubcategories(data);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };
    {/****Product STOCK and FeatureTag**** */ }

    const [productStock, setProductStock] = useState('');

    const [selectedTags, setSelectedTags] = useState([]);


    //****SELECTED POT***** */


    const [selectedPots, setSelectedPots] = useState([]);




    const handlePotChange = (selectedOptions) => {
        setSelectedPots(selectedOptions);
    };


    // Frontend code (assuming you're using JavaScript in a web application)

    // Function to upload product care data
    // Function to upload product care data
    const uploadProductcarelist = async () => {
        try {
            // Gather the data from your form or wherever it's coming from
            const formData = {
                title: productTitle,
                careName: plantcareData.name,
                caredes: plantcareData.description,
                maincategory: selectedCategory,
                category: selectedsubCategory,
                subcategory: selectedsubCategory2,
                photo: plantcareData.image
            };

            // Send a POST request to the server to check for duplicates and insert data
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/selectedPlantcare`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // If the request was successful (status code 200-299), show a success message
                const data = await response.json();
                setMessage('Product care data inserted successfully');
            } else if (response.status === 400) {
                // If status is 400, it means there are duplicates
                const data = await response.json();
                setMessage(data.error);
            } else {
                // Handle other errors
                setMessage('Error inserting product data');
            }
        } catch (error) {
            // Handle any network or unexpected errors
            setMessage('Error inserting product data: ' + error.message);
        }
        fetchselectedcarename();
    };

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    const uploadLengthDetails = async () => {
        try {
            // Gather the data from your form or wherever it's coming from
            const formData = {
                length: name,
                price: parseFloat(price),
                currency: SelectedCurrency,
                productName: productTitle, // Assuming productTitle is the same as the title in the previous example
                mainCategory: selectedCategory,
                category: selectedsubCategory,
                subCategory: selectedsubCategory2,
            };

            // Send a POST request to the server to check for duplicates and insert data
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/selectedLengthDetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // If the request was successful (status code 200-299), show a success message
                const data = await response.json();
                setMessage('Length details inserted successfully');
            } else if (response.status === 400) {
                // If status is 400, it means there are duplicates
                const data = await response.json();
                setMessage(data.error);
            } else {
                // Handle other errors
                setMessage('Error inserting length details');
            }
        } catch (error) {
            // Handle any network or unexpected errors
            setMessage('Error inserting length details: ' + error.message);
        }
        // Fetch other data or perform any other actions as needed
        // fetchselectedcarename();
        fetchselectedLength();
    };














    const [selectecarelist, setselectecarelist] = useState([]);
   
    const fetchselectedcarename = async (subcategory, title) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getselectedCarename/${productTitle}`);
            if (response.ok) {
                const data = await response.json();
                setselectecarelist(data);
            }
        } catch (error) {
            console.error('Error fetching selected carename:', error);
        }
    };

    {/*****PLANT LENGTH***** */ }

    const [selecteLengthDetails, setselecteLengthDetails] = useState([]);
    const fetchselectedLength = async (subcategory, title) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getSelectedLengthDetails/${selectedsubCategory2}/${productTitle}`);
            if (response.ok) {
                const data = await response.json();
                // console.log('Data received from server:', data);
                setselecteLengthDetails(data);
            } else {
                console.error('Error fetching selected Length:', response.statusText);
                setselecteLengthDetails([]); // Handle empty response here
            }
        } catch (error) {
            console.error('Error fetching selected Length:', error);
            setselecteLengthDetails([]); // Set to an empty array or handle the error state as appropriate
        }
    };




    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [Addname, setAddname] = useState('');

    const handleNameChange = (selectedOption) => {
        setName(selectedOption.value);
    };

    const handleADDNameChange = (event) => {
        setAddname(event.target.value);
    };

    const handlePriceChange = (event) => {
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
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addLengthTag`, {
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
                setSelectedCurrency('');
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


    const [lengthTags, setLengthTags] = useState([]);

    useEffect(() => {
        // Fetch length tags from the server when the component mounts  fetchLengthTags
        fetchLengthTags();
    }, []);

    const fetchLengthTags = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getLengthTags`); // Replace with your server's endpoint

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
            value: 'AED',
            label: 'AED',
        },
        {
            value: 'JPY',
            label: '¥',
        },
    ];
    const [SelectedCurrency, setSelectedCurrency] = useState('');
    const handleCurrencySelect = (currencyName) => {
        setSelectedCurrency(currencyName);
    };

    //product price currency
    const [SelectedCurrency1, setSelectedCurrency1] = useState('');
    const handleCurrencySelect1 = (currencyName) => {
        setSelectedCurrency1(currencyName);
    };



    const [selectedCareList, setSelectedCareList] = useState(selectecarelist);

    const handleDeleteCareName = async (selectedsubCategory2, productTitle, careName) => {
        try {
            // Send a DELETE request to your server to delete the care name based on the criteria
            await fetch(`${process.env.REACT_APP_BASE_URL}/deleteselectedCarename/${selectedsubCategory2}/${productTitle}/${careName}`, {
                method: 'DELETE',
            });


            //   // Update the selectedCareList by removing the deleted care name
            //   setSelectedCareList((prevList) =>
            //     prevList.filter((item) => item.careName !== title)
            //   );
        } catch (error) {
            setMessage('Error deleting care name:', error);
        }
        fetchselectedcarename();
    };

    const handleDeleteLength = async (selectedsubCategory2, length, productTitle) => {
        try {
            // Send a DELETE request to your server to delete the care name based on the criteria
            await fetch(`${process.env.REACT_APP_BASE_URL}/deleteSelectedLengthDetails/${selectedsubCategory2}/${length}/${productTitle}`, {
                method: 'DELETE',
            });
        } catch (error) {
            setMessage('Error deleting care name:', error);
        }
        fetchselectedLength();
    };


    //selected Length

    const [selectedLength, setselectedLength] = useState('');

    const handleLengthChange = (selectedOptions) => {
        setselectedLength(selectedOptions);
    };


    {/*****PRODUCT CATEGORY*******/ }

    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <MainWrapper>
                    <Wrapper>
                        <h3>Add product here</h3>
                        {/* First Column ********** */}
                        <div className='first-div' >
                            <div className="formFirst">
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Product"
                                    value={productTitle}
                                    onChange={(e) => setProductTitle(e.target.value)}
                                    Small
                                    InputProps={{
                                        style: {
                                            width: '550px',
                                            borderColor: 'blue',
                                            backgroundColor: 'white' // Change the borderColor to black
                                        },
                                    }}
                                />
                               
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Scientific Name"
                                    value={scientific}
                                    onChange={(e) => setProductscientic(e.target.value)}
                                    Small
                                    InputProps={{
                                        style: {
                                            width: '550px',
                                            borderColor: 'blue',
                                            backgroundColor: 'white' // Change the borderColor to black
                                        },
                                    }}
                                />

                                    <textarea
                                    className='tex-area'
                                        minRows={3}  // Set the minimum number of rows for the textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setdescription(e.target.value)}
                                        style={{
            
                                            // borderColor: 'black',
                                            backgroundColor: 'white',
                                        }}
                                    // Set the maximum number of characters allowed
                                    />

                                {/* <h2>File Upload</h2> */}

                                {/* <h3>Drag and Drop or Browse to Upload Files</h3> */}

                                <div className="formSecond">
                                    {/* <h4>Selected Files</h4> */}
                                    <div className='img-div'>
                                        {selectedFiles.map((file, index) => (
                                            <Grid item key={index} xs={4}>
                                                <div className="image-container">
                                                    {file && (
                                                        <React.Fragment>
                                                            
                                                            <img
                                                                src={file ? URL.createObjectURL(file) : ''}
                                                                alt={file ? file.name : ''}
                                                                className="uploaded-image"
                                                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                onClick={() => removeFile(file)}
                                                                className="delete-icon"
                                                            />
                                                        </React.Fragment>
                                                    )}
                                                </div>
                                            </Grid>
                                        ))}

                                        <div className="formThird">
                                            <div {...getRootProps()} className="dropzone" style={{ border: '.2px solid black', width: '130px',minHeight:'140px', height: '87%', display: 'flex', alignItems: 'center', justifyContent: 'center',cursor:'pointer' }}>
                                                <input {...getInputProps()} />
                                                <FontAwesomeIcon icon={faUpload} size="2x" />
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileInputChange}
                                                style={{ display: 'none' }}
                                                id="fileInput"
                                            />
                                            <p>Add images</p>
                                        </div>

                                    </div>
                                </div>

                            </div>


                            {/* First Column  file upload ********** */}


                            {/*****Product Category***** */}

                            <div className='formFour'>
                                <div className='category-row'>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select"
                                    className='style-p'
                                    helperText="Please select Main Category"
                                    style={{width:'30%' ,backgroundColor:'#fff'}}
                                >
                                    {mainCategory.map((option) => (
                                        <MenuItem
                                            key={option.name}
                                            value={option.name}
                                            onClick={() => handleCategorySelect(option.name)} // Corrected placement of onClick event
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField

                                    select
                                    label="Select"
                                    className='style-p'
                                    helperText="Please select Category"
                                    style={{ width:'30%'  ,backgroundColor:'#fff'}}
                                >
                                    {categories.map((option) => (
                                        <MenuItem key={option.name} value={option.name}
                                            onClick={() => handlesubcategorySelect(option.name)} // Corrected placement of onClick event
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select"
                                    className='style-p'
                                    helperText="Please select Category"
                                    style={{ width:'30%' ,backgroundColor:'#fff' }}
                                >
                                    {subcategories.map((option) => (
                                        <MenuItem key={option.name} value={option.name}
                                            onClick={() => handlesubcategorySelect2(option.name)}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                </div>

                                {/*****Product Category***** */}

                                {/*****Stock AND Price********* */}
                              <div className='product-price'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Stock"
                                        value={productStock}
                                        onChange={(e) => setProductStock(e.target.value)}
                                        InputProps={{
                                            style: {
                                                borderColor: 'blue',
                                                backgroundColor: 'white',
                                                minWidth:'345px',
                                            },
                                            // endAdornment: (
                                            //     <InputAdornment position="end">
                                            //         Stock: {productStock} {/* Display the stock count here */}
                                            //     </InputAdornment>
                                            // ),
                                        }}
                                    />
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Price"
                                        value={productprice}
                                        onChange={(e) => setProductPrice(e.target.value)}

                                        Small
                                        InputProps={{
                                            style: {
                                                minWidth:'345px',
                                                borderColor: 'blue',
                                                backgroundColor: 'white' // Change the borderColor to black
                                            },
                                        }}
                                    />

                                    {/* <TextField

                                        select
                                        style={{ paddingLeft: '10px' }}

                                        width="40px"
                                        color="success"

                                        onChange={(e) => handleCurrencySelect1(e.target.value)}
                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField> */}

                              </div>


                            </div>

                            

                            {/*****Product Category***** */}
                        </div>

                        {/* Second Column (Empty column in this example)
                    <Grid item xs={12} sm={6} md={2}>
                        <h1>second</h1>
                    </Grid> */}

                        {/* Third Column */}
                        <div className='product-additional'>

                               <div className='dimensions'>
                                 {/* Plot Section */}
                                <div className='pot'>
                                <span>Pot</span>
                                {/* <p>Pot content goes here...</p> */}
                                    <Select
                                        isMulti
                                        options={PotNames.map((option) => ({
                                            value: option.name,
                                            label: option.name,
                                        }))}
                                        styles={customStyles}
                                        value={selectedPots}
                                        onChange={(selectedOptions) => {
                                            handlePotChange(selectedOptions);
                                        }}
                                    />
                                </div>
                                { /* ########################################################################/}

                                {/* Length Section */}
                                <div className='length'>
                                    <span>Plant Length</span>

                                <div>
                                    <Select
                                        options={lengthTags.map((tag) => ({
                                            value: tag.length,
                                            label: `${tag.length}`,
                                        }))}
                                        className='select-multi'
                                        value={{ value: name, label: name }}
                                        onChange={handleNameChange}
                                        styles={customStyles}

                                    />
                                    <IconButton onClick={handleOpenDialog2} style={{ borderRadius: '50%' }}>
                                        <AddIcon style={{ color: 'black' }} />
                                    </IconButton>
                                </div>
                                </div>
                                <div className='length-price'>
                                <span>Length Price</span>
                                    <div>
                                    <TextField
                                    
                                        variant="outlined"
                                        InputProps={{
                                            style: { borderRadius: '5px 0px 0px 5px' },
                                            classes: {
                                                notchedOutline: 'custom-notched-outline', // Additional class for more specificity
                                            },
                                        }}
                                        value={price} onChange={handlePriceChange}
                                    />

                                    {/* <TextField
                                        id="outlined-select-currency"
                                        select
                                        style={{ paddingLeft: '10px' }}
                                        defaultValue="EUR"
                                        width="40px"
                                        color="success"

                                        onChange={(e) => handleCurrencySelect(e.target.value)}
                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>  */}
                                    <button type='button' className='btn' onClick={uploadLengthDetails}>ADD</button>
                                    </div>
                                    <div className='selected-length'>
                               <span>Length List:</span>
                                <ul>
                                    {selecteLengthDetails.map((Length, index) => (
                                        <li key={index}>
                                            <p>{Length.length}{' : '}{Length.price}{' '}{Length.currency}</p>
                                            <button className='dlt-btn'
                                                onClick={() =>
                                                    handleDeleteLength(Length.subCategory, Length.length, Length.productName)
                                                }
                                            >
                                                <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }} />

                                            </button>
                                        </li>
                                    ))}
                                </ul>

                               </div>
                                </div>

                                {message && <p className='message-first'>{message}</p> }


                               </div>


                                {/* Dimension Section */}
                                {/* <span>Dimension</span> */}
                                



                                <div className='features-div'>
                                <span>Features</span>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Select
                                        isMulti
                                        options={featureNames.map((name) => ({ value: name.name, label: name.name }))}
                                        value={selectedFeatures}
                                        styles={customStyles}
                                        onChange={(selectedOptions) => {
                                            handleFeatureChange(selectedOptions);
                                        }}
                                    /> <IconButton onClick={handleOpenDialog} style={{ borderRadius: '50%' }}>
                                        <AddIcon style={{ color: 'black' }} />
                                    </IconButton>
                                </div>
                                </div>


                                <div className='plant-care-div'>
                                <div className='form'>
                                <div className='care-type-div'>
                                <span>Care Type</span> 
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        style={{  minWidth: '345px' ,backgroundColor:'#fff'}}

                                        width="150px"
                                        color="success"
                                        onChange={(e) => setCareType(e.target.value)}
                                    // onChange={(e) => handleCategorySelect(e.target.value)
                                    // }
                                    >
                                        {Carename.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                    <div className='plantcares-div'>
                                        <TextField
                                            id="outlined-select-currency"
                                            select
                                            style={{  minWidth: '340px',backgroundColor:'#fff' }} // Adjust the width as needed
                                            value={selectedPlantcare}
                                            color="success"
                                            onChange={handleDropdownChange}
                                        >
                                            {plantcareNames.map((name, option) => (
                                                <MenuItem key={option} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </TextField>


                                        {/* <select value={selectedPlantcare} onChange={handleDropdownChange}>
                                        <option value=""></option>
                                        {plantcareNames.map((name, index) => (
                                            <option key={index} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select> */}
                                    </div>
                                    
                                    {selectedPlantcare && (
                                        <div className='care-btn'>
                                        <div className = 'care-btn-img' style={{ display: 'flex', alignItems: 'center' ,gap:'0',background:'#fff',width:'100%'}}>
                                            <img
                                                src={plantcareData.image}
                                                alt="plantcare"
                                                style={{ width: '60px', height: '45px', objectFit: 'contain', borderRadius: '30%', marginRight: '20px' }}
                                            />
                                            <span>{plantcareData.name}</span>
                                            {/* <div>
                                            <span>{plantcareData.name}</span>
                                            <textarea
                                                id="description"
                                                value={plantcareData.description}
                                                style={{ width: '100%', height: '100px', resize: 'both' }}
                                                readOnly
                                            />
                                        </div> */}
                                        </div>
                                          <button  onClick={uploadProductcarelist} type='button' className='btn plantcare-btn' >  ADD </button> </div>
                                    )}
                                  
                               
                                </div>
                                <div className='plantcare-show'>
                                    
                                {/* Display selected PlantCare details */}

                                <div className='textarea-form'>
                                    {selectedPlantcare && (
                                        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px' }}>

                                            <textarea
                                                id="description"
                                                value={plantcareData.description}
                                                className="textareap" // Apply the CSS class here
                                                color='success'
                                                onChange={(e) => setPlantcareData({ ...plantcareData, description: e.target.value })}

                                            />

                                        </div>
                                    )}</div>
                                
                                <div className='plantcare-show-list' >
                                    
                                 
                                    <div className='selected-plantcare'  >

                                    {selectecarelist && <span>Plant Care List:</span>}
                                        <ul>
                                            {selectecarelist.map((careName, index) => (
                                                <li key={index}>
                                                    <p>{careName.careName}</p>
                                                    <button className='dlt-btn'
                                                        onClick={() =>
                                                            handleDeleteCareName(careName.subcategory, careName.title, careName.careName)
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }} />

                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                    </div>

                                </div>
                                </div>


                                </div>




                         
                        </div>
                        <button className="btn upload-button" onClick={uploadFiles}>
                                Submit
                            </button> 
                            <br></br>
                          {message &&   <p className="message">{message}</p>}
                    </Wrapper>
                    </MainWrapper>
                </div>
            {/* Add Feature Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Feature</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Feature"
                        variant="outlined"
                        fullWidth
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>


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


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog2}>Cancel</Button>
                    <Button onClick={handleLengthSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ProductAdd;

