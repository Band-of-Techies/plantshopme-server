import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, Container, DialogContent, FormControlLabel, Checkbox, FormGroup, DialogActions, Grid, TextField, MenuItem, Typography } from '@mui/material';
import Navbar from '../../navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';
import DOMPurify from 'dompurify';
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
import { Wrapper } from './addProductWrapper';
import Measures from './Measures';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OtherProducts = () => {


    const [isHidden, setIsHidden] = useState(false);
    const [details, setDetails] = useState([]);

    useEffect(() => {
        // Fetch product details on component mount
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/details-by-product/${productTitle}`);
            const detailsData = await response.json();
            setDetails(detailsData);
        } catch (error) {
            // toast.error('Error fetching product details:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/delete-by-id/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            toast.success('Delete result:', result);

            // After successful deletion, refresh the product details
            fetchProductDetails();
        } catch (error) {
            toast.error('Error deleting product:', error);
        }
    };







    const [PotNames, setPotNames] = useState([]);
    const fetchPots = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/listAllPots`);
            setPotNames(response.data);
        } catch (error) {
            // toast.error('Error fetching Pot names:', error);
        }
    };

    useEffect(() => {
        fetchPots();
        fetchselectedcarename();

    }, []);

    ///************************************************************************************************************************* */
    const [mainCategorynew, setMainCategorynew] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [thirdCategory, setThirdCategory] = useState([]);
    const [selectedThirdCategories, setSelectedThirdCategories] = useState([]);

    //****************************Dimensions delete */

    const handleDimDelete = (id) => {
        // Make a request to your backend to delete the dimension
        // Replace '/api/deletedimensions' with your actual API endpoint
        fetch(`${process.env.REACT_APP_BASE_URL}/deletedimensions/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((deletedDimension) => {
                toast.success('Fields deleted successfully:');
                fetchFields();
            })
            .catch((error) => toast.error('Error deleting Fields:', error));
    };

    const handleDimDelete1 = (id) => {
        // Make a request to your backend to delete the dimension
        // Replace '/api/deletedimensions' with your actual API endpoint
        fetch(`${process.env.REACT_APP_BASE_URL}/deletedimensions1/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((deletedDimension) => {
                toast.success('Fields deleted successfully: Plz select Field1');
                fetchDimensions();
            })
            .catch((error) => toast.error('Error deleting Fields:', error));
    };


    const handleSubmitca = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/submitCategories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    maincategory: selectedCategories,
                    category: selectedSubCategories,
                    subcategory: selectedThirdCategories,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Categories successfully inserted:', data.insertedCategories);
                // Optionally, reset the selected categories after successful insertion
                setSelectedCategories([]);
                setSelectedSubCategories([]);
                setSelectedThirdCategories([]);
            } else {
                toast.error('Failed to insert categories');
            }
        } catch (error) {
            toast.error('Error submitting categories:', error);
        }
    };



    const fetchCategoriesnew = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getMainCategories`);
            if (response.ok) {
                const data = await response.json();
                setMainCategorynew(data);
                fetchSubCategories([]); // Initial call with an empty array
            }
        } catch (error) {
            toast.error('Error fetching Main categories:', error);
        }
    };

    const fetchSubCategories = async (parentCategories) => {
        try {
            if (!parentCategories || parentCategories.length === 0) {
                setSubCategory([]);
                return;
            }

            const params = new URLSearchParams();
            parentCategories.forEach((category) => {
                params.append('parentCategories', category);
            });

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getCategoriesByParent?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setSubCategory(data);
                setThirdCategory([]); // Reset third category when main category changes
            }
        } catch (error) {
            toast.error('Error fetching Sub categories:', error);
        }
    };

    const fetchThirdCategories = async (subCategories) => {
        try {
            if (!subCategories || subCategories.length === 0) {
                setThirdCategory([]);
                return;
            }

            const params = new URLSearchParams();
            subCategories.forEach((category) => {
                params.append('subCategory', category); // Corrected to 'subCategory'
            });

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getThirdCategoriesBySub?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setThirdCategory(data);
            }
        } catch (error) {
            // toast.error('Error fetching Third categories:', error);
        }
    };

    const handlefieldstatus = () => {

        setInputValue('');
        setInputValuedi('');
        setInputValued2('');
        setInputValuePrice('');
        setSelectedDimension('');
        setDimensionOptions('');
        setselectedcolors('');
        setSelectedPots1('');

    }

    const handleMainCategoryChange = (event) => {
        const { name } = event.target;
        const updatedSelectedCategories = event.target.checked
            ? [...selectedCategories, name]
            : selectedCategories.filter((category) => category !== name);

        setSelectedCategories(updatedSelectedCategories);
    };

    useEffect(() => {
        fetchCategoriesnew();
    }, []);

    useEffect(() => {
        fetchSubCategories(selectedCategories);
    }, [selectedCategories]);

    const handleSubCategoryChange = (event) => {
        const { name } = event.target;
        const updatedSelectedSubCategories = event.target.checked
            ? [...selectedSubCategories, name]
            : selectedSubCategories.filter((category) => category !== name);

        setSelectedSubCategories(updatedSelectedSubCategories);
    };

    useEffect(() => {
        fetchThirdCategories(selectedSubCategories);
    }, [selectedSubCategories]);

    const handleThirdCategoryChange = (event) => {
        const { name } = event.target;
        const updatedSelectedThirdCategories = event.target.checked
            ? [...selectedThirdCategories, name]
            : selectedThirdCategories.filter((category) => category !== name);

        setSelectedThirdCategories(updatedSelectedThirdCategories);
    };

    ///**************************************************************************************************************************************** */

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
    const [setFieldStatus, SetSelectedFieldStatus] = useState('');



    useEffect(() => {
        // Make a GET request to fetch the PlantCare names
        axios.get(`${process.env.REACT_APP_BASE_URL}/getPlantcareNames`)
            .then((response) => {
                // Set the received names in the state
                setPlantcareNames(response.data);
            })
            .catch((error) => {
                //toast.error('Error fetching PlantCare names:', error);
            });

        // Call the function to fetch feature names initially
        fetchFeatureNames();
        //product Maincategory

        // fetchCategories();
    }, []);

    const [selectedFeatures, setSelectedFeatures] = useState([]);



    const handleFeatureChange = (selectedOptions) => {
        setSelectedFeatures(selectedOptions);
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
                // toast.error('Error fetching feature names:', error);
            });
    };

    /// OTHER PRODUCTS DIMENSIONS AND LENGTH


    const Dim = [
        {
            value: 'Single Field',
            label: 'Single Field',
        },
        {
            value: 'Multi Field',
            label: 'Multi Field',
        },

    ];

    const [selectedCategoryDim, setSelectedCategoryDim] = useState('');
    const [selectedimension, setSelectedDimension] = useState('');
    const [dimensionOptions, setDimensionOptions] = useState([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputValuedi, setInputValuedi] = useState('');
    const [inputValued2, setInputValued2] = useState('');
    const [inputValuePrice, setInputValuePrice] = useState('');
    const [dataList, setDataList] = useState([]);

    const [colorslist, setcolorsList] = useState('');

    const [fieldlist, setFieldlist] = useState('');

    const [newColor, setNewColor] = useState('');
    const [selectedcolors, setselectedcolors] = useState('')
    //Colors #####################################################################
    const [field, setField] = useState('');

    const handleFieldChange = (e) => {
        setField(e.target.value);
    };

    const handleInsertField = async () => {
        try {
            // Assuming your server is running on ${process.env.REACT_APP_BASE_URL}
            await axios.post(`${process.env.REACT_APP_BASE_URL}/insertField`, { field });
            // Optionally, you can reset the form fields after successful insertion
            setField('');
            toast.success('Field inserted successfully!');
        } catch (error) {
            toast.error('Error inserting field:', error);
        }
        fetchFields();
    };

    const fetchFields = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getAllFields`);
            toast.success(response.data); // Log the response to inspect the structure

            const fieldsArray = response.data; // Adjust this based on the actual structure

            setFieldlist(fieldsArray);
        } catch (error) {
            toast.error('Error fetching Fields:', error);
        }
    };


    useEffect(() => {

        fetchFields();
    }, []);
    const [isDialogOpen2, setDialogOpen2] = useState(false);
    const [isDialogOpen3, setDialogOpen3] = useState(false);

    const fetchColors = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getAllColors`);
            const colors = response.data;
            setcolorsList(colors);
        } catch (error) {
            toast.error('Error fetching Colors:', error);
        }
    };

    useEffect(() => {
        fetchColors();

    }, []);


    const addColor = async () => {
        try {
            // Assuming you have an API endpoint to add a new color
            await axios.post(`${process.env.REACT_APP_BASE_URL}/insertColor`, { color: newColor });
            // After adding the color, refetch the colors
            fetchColors();
            // Optionally, you can clear the input field
            setNewColor('');
        } catch (error) {
            toast.error('Error adding color:', error);
        }
        fetchColors();
    };

    const fetchDimensions = async (category) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getDimensionTags/${category}`);
            const dimensionTags = response.data;
            setDimensionOptions(dimensionTags);
        } catch (error) {
            //toast.error('Error fetching Dimensions:', error);
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

    const handleDialogOpen2 = () => {
        setDialogOpen2(true);
    };

    const handleDialogOpen3 = () => {
        setDialogOpen3(true);
    };
    const handleDialogClose3 = () => {
        setDialogOpen3(false);
    };

    const handleDialogClose2 = () => {
        setDialogOpen2(false);
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
            toast.error('Error adding option:', error);
        }
    };

    const handleAddToList = () => {

        // Set Value2 dynamically based on available values
        const value2 = inputValued2 || selectedcolors || selectedPots1;



        // Add the entered data to the list
        setDataList(prevList => [
            ...prevList,
            {
                Value1: inputValuedi,
                Field2: selectedimension,
                Field1: selectedCategoryDim,
                Price: inputValuePrice,
                Color: selectedcolors,
                Value2: value2,
            },
        ]);

        // if (setFieldStatus === "Multi Field") {

        // // Clear the input fields
        // setInputValue('');
        // setInputValuedi('');

        setInputValuePrice('');
        // setSelectedDimension('');
        // setDimensionOptions('');
        setselectedcolors('');
        setSelectedPots1('');
        // }
    };

    const handleDeleteItem = (index) => {
        // Remove the item at the specified index from the list
        setDataList(prevList => prevList.filter((_, i) => i !== index));
    };

    const handleSubmitDim = async () => {
        try {
            // Iterate through each set of data and insert into the database
            // for (const item of dataList) {
            let value2 = inputValued2 || selectedcolors || selectedPots1 || '';

            await axios.post(`${process.env.REACT_APP_BASE_URL}/selectedDimensionsDetails`, {
                Value1: inputValuedi,
                Field2: selectedimension,
                Field1: selectedCategoryDim,
                Price: inputValuePrice,

                Value2: value2,
                productName: productTitle,
                maincategory: selectedCategory,
                category: selectedsubCategory,
                subcategory: selectedsubCategory2,
            });

            fetchProductDetails();
            setInputValuePrice('');
            setInputValued2('');
            setselectedcolors('');
            setSelectedPots1('');
        } catch (error) {
            // Handle error response
            if (error.response) {
                // The request was made and the server responded with a status code
                // Display the error message on the frontend using toast
                toast.error('Error: ' + error.response.data.error);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response received from the server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error('Error during request setup: ' + error.message);
            }
        }
    };





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
                toast.error(`Error fetching PlantCare data for ${selectedPlantcareName}:`, error);
            });
    };



    // const Carename = [
    //     {
    //         value: 'Seed Care',
    //         label: 'Seed Care',
    //     },
    //     {
    //         value: 'Plant Care',
    //         label: 'Plant Care',
    //     },

    // ];

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
    const [scientific, setProductscientic] = useState('')
    const [SKU, setSKU] = useState('')
    const [Mdiscription, setMdiscription] = useState('');
    const [Mname, setMname] = useState('');

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
            const sanitizedContent = DOMPurify.sanitize(SKU);
            console.log('Sanitized Content:', sanitizedContent);
            // Send a POST request to server endpoint to upload files
            await axios.post(`${process.env.REACT_APP_BASE_URL}/addOtherProduct`, formData, {
                params: {
                    title: productTitle,
                    scienticName: scientific,
                    impdescription: SKU ,
                    Mname: Mname,
                    Mdiscription: Mdiscription,
                    description: description,
                    maincategory: selectedCategories,
                    category: selectedSubCategories,
                    subcategory: selectedThirdCategories,
                    stock: productStock,
                    FeatureTag: selectedFeatureNames,
                    length: selectedLengthNames,
                    Pots: selectedPotsNames,
                    careName: plantcareData.name,
                    careType: 'plant',
                    caredes: plantcareData.description,
                    price: productprice,
                    currency: SelectedCurrency1,

                },
            });
            toast.success('Details Added successfully');
            // handleSubmitDim();
            // Reset selected files and show success message
            setSelectedFeatures([]);
            setProductTitle('');
            setProductscientic('');
            setSKU('');
            setMdiscription('');
            setMname('');
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
            setSelectedPlantcare([]);
            setselectecarelist([])
            setDetails('')
            setSelectedDimension('');
            setSelectedSubCategories([])
            setSelectedThirdCategories([]);


        } catch (error) {
            // Handle error response
            if (error.response) {
                // The request was made and the server responded with a status code
                // Display the error message on the frontend using toast
                toast.error('Error: ' + error.response.data.error);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response received from the server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error('Error during request setup: ' + error.message);
            }
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
        // fetchSubcategories(categoryName);
        // fetchSubcategories2(categoryName);

    }

    const handlesubcategorySelect = (categoryName) => {

        // fetchSubcategories2(categoryName);
        setSelectedsubCategory(categoryName)
    }

    const handlesubcategorySelect2 = (categoryName) => {

        // fetchSubcategories2(categoryName);
        setSelectedsubCategory2(categoryName)
    }
    // const fetchCategories = async () => {
    //     try {
    //         const response = await fetch('${process.env.REACT_APP_BASE_URL}/getMainCategories');
    //         if (response.ok) {
    //             const data = await response.json();
    //             setMainCategory(data);
    //         }
    //     } catch (error) {
    //         toast.error('Error fetching Main categories:', error);
    //     }
    // };

    // const fetchSubcategories = async (selectedCategory) => {
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getCategoriesByParent/${selectedCategory}`);
    //         if (response.ok) {
    //             const data = await response.json();
    //             setCategories(data);
    //         }
    //     } catch (error) {
    //         toast.error('Error fetching categories:', error);
    //     }
    // };

    // const fetchSubcategories2 = async (selectedsubCategory) => {
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getSubcategories/${selectedCategory}/${selectedsubCategory}`);
    //         if (response.ok) {
    //             const data = await response.json();
    //             setSubcategories(data);
    //         }
    //     } catch (error) {
    //         toast.error('Error fetching subcategories:', error);
    //     }
    // };
    {/****Product STOCK and FeatureTag**** */ }

    const [productStock, setProductStock] = useState('');

    const [selectedTags, setSelectedTags] = useState([]);


    //****SELECTED POT***** */


    const [selectedPots, setSelectedPots] = useState([]);

    const [selectedPots1, setSelectedPots1] = useState('');


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

    const fetchselectedcarename = async () => {
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
                // toast.success('Data received from server:', data);
                setselecteLengthDetails(data);
            } else {
                // toast.error('Error fetching selected Length:', response.statusText);
                setselecteLengthDetails([]); // Handle empty response here
            }
        } catch (error) {
            //toast.error('Error fetching selected Length:', error);
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
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addDimensionTag`, {
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
                setMessage('Dimension tag added successfully');
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
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getDimensionTags`); // Replace with your server's endpoint

            if (response.ok) {
                const data = await response.json();
                setLengthTags(data);
            } else {
                // Handle errors or show an error message
                //toast.error('Error fetching length tags');
            }
        } catch (error) {
            // Handle network or unexpected errors
            // toast.error('Error fetching length tags:', error);
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
            await fetch(`${process.env.REACT_APP_BASE_URL}/deleteselectedCarename/${productTitle}/${careName}`, {
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

    const handleimportantInputChange = (e) => {
        const sanitizedContent = DOMPurify.sanitize(e.target.innerHTML);
  setSKU(sanitizedContent);
    };
    {/*****PRODUCT CATEGORY*******/ }

    return (
        <><div className='single'>
            <Sidebar />
            <ToastContainer />
            <div className='singleContainer'>
                <Navbar />
                <Wrapper>
                    <h3>Add product here</h3>
                    {/* First Column ********** */}
                    <div className='first-div'>
                        <div className="formFirst">
                            <TextField
                                required
                                id="outlined-required"
                                label="Product Name"
                                value={productTitle}
                                onChange={(e) => setProductTitle(e.target.value)}
                                Small
                                InputProps={{
                                    style: {
                                        width: '550px',
                                        borderColor: 'blue',
                                        backgroundColor: 'white' // Change the borderColor to black
                                    },
                                }} />

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
                                }} />
                            <textarea
                                required
                                className='tex-area'
                                minRows={3}
                                placeholder="Important Description"
                                value={SKU}
                                onChange={(e) => setSKU(e.target.value)}

                                style={{
                                    // width: '550px',
                                    // borderColor: 'green',
                                    backgroundColor: 'lightcoral', // Set the background color to light red
                                }} />
                            {/* <div>
                                <div
                                    contentEditable
                                    className='tex-area'
                                    placeholder='Important Description'
                                    onChange={(e) => setSKU(e.target.value)}
                                    dangerouslySetInnerHTML={{ __html: SKU }}
                                    style={{
                                        border: '1px solid lightcoral',
                                        padding: '5px',
                                        minHeight: '100px',
                                        minWidth:'800px',
                                    }}
                                />
                            </div> */}

                            <textarea
                                className='tex-area'
                                minRows={3} // Set the minimum number of rows for the textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                style={{
                                    // borderColor: 'black',
                                    backgroundColor: 'white',
                                }} />


                            <div>

                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Meta title"
                                    value={Mname}
                                    onChange={(e) => setMname(e.target.value)}
                                    Small

                                    InputProps={{
                                        style: {
                                            width: '550px',
                                            borderColor: 'blue',
                                            backgroundColor: 'white',


                                        },
                                    }} /></div>


                            <textarea
                                required
                                className='tex-area'
                                minRows={3}
                                placeholder="Meta Description"
                                value={Mdiscription}
                                onChange={(e) => setMdiscription(e.target.value)}

                                style={{
                                    // width: '550px',
                                    // borderColor: 'green',
                                    backgroundColor: 'white', // Set the background color to light red
                                }} />


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
                                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            onClick={() => removeFile(file)}
                                                            className="delete-icon" />
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        </Grid>
                                    ))}

                                    <div className="formThird">
                                        <div {...getRootProps()} className="dropzone" style={{ border: '.2px solid black', width: '130px', minHeight: '140px', height: '87%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <input {...getInputProps()} />
                                            <FontAwesomeIcon icon={faUpload} size="2x" />
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileInputChange}
                                            style={{ display: 'none' }}
                                            id="fileInput" />
                                        <p>Add images</p>
                                    </div>

                                </div>
                            </div>

                        </div>


                        {/* First Column  file upload ********** */}


                        {/*****Product Category***** */}
                        <h4>Product categories</h4>



                        <div className='formFour'>

                            <Container>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <FormGroup>
                                            {mainCategorynew.map((category) => (
                                                <FormControlLabel
                                                    key={category.id}
                                                    control={<Checkbox
                                                        name={category.name}
                                                        onChange={handleMainCategoryChange}
                                                        checked={selectedCategories.includes(category.name)} />}
                                                    label={category.name} />
                                            ))}
                                        </FormGroup>
                                        {/* <div>
            <strong>Selected Main Categories:</strong> {selectedCategories.join(', ')}
        </div> */}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormGroup>
                                            {subCategory.map((category) => (
                                                <FormControlLabel
                                                    key={category.id}
                                                    control={<Checkbox
                                                        name={category.name}
                                                        onChange={handleSubCategoryChange}
                                                        checked={selectedSubCategories.includes(category.name)} />}
                                                    label={category.name} />
                                            ))}
                                        </FormGroup>
                                        {/* <div>
            <strong>Selected Sub Categories:</strong> {selectedSubCategories.join(', ')}
        </div> */}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormGroup>
                                            {thirdCategory.map((category) => (
                                                <FormControlLabel
                                                    key={category.id}
                                                    control={<Checkbox
                                                        name={category.name}
                                                        onChange={handleThirdCategoryChange}
                                                        checked={selectedThirdCategories.includes(category.name)} />}
                                                    label={category.name} />
                                            ))}
                                        </FormGroup>
                                        {/* <div>
            <strong>Selected Third Categories:</strong> {selectedThirdCategories.join(', ')}
        </div> */}
                                    </Grid>
                                </Grid>

                            </Container>




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
                                            minWidth: '345px',
                                        },
                                        // endAdornment: (
                                        //     <InputAdornment position="end">
                                        //         Stock: {productStock} {/* Display the stock count here */}
                                        //     </InputAdornment>
                                        // ),
                                    }} />
                                {/* <TextField
        required
        id="outlined-required"
        label="Price"
        value={productprice}
        onChange={(e) => setProductPrice(e.target.value)}

        Small
        InputProps={{
            style: {
                minWidth: '345px',
                borderColor: 'blue',
                backgroundColor: 'white' // Change the borderColor to black
            },
        }}
    /> */}

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


                        {/* Plot Section */}


                        {/* ########################################################################/}
<h4>
            {/* Length Section */}

                        <h4>Select Dimensions</h4>
                        <div style={{ padding: '20px' }}>
                            <div style={{ alignItems: 'center', marginBottom: '20px', paddingTop: '10px' }}>
                                <div style={{ marginRight: '20px', paddingBottom: "20px" }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>

                                        <TextField
                                            id="outlined-select-category"
                                            select
                                            label="Select Parameters"
                                            style={{ minWidth: '245px', paddingRight: '10px' }}
                                            color="success"
                                            onChange={(e) => {
                                                SetSelectedFieldStatus(e.target.value);
                                                // Call your function when the selection changes
                                            }}
                                        >
                                            {Array.isArray(fieldlist) &&
                                                Dim.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.value}
                                                    </MenuItem>
                                                ))}
                                        </TextField>


                                        <TextField
                                            id="outlined-select-category"
                                            label="Select Field 1"
                                            select

                                            style={{ minWidth: '240px' }}
                                            color="success"
                                            onChange={(e) => setSelectedCategoryDim(e.target.value)}

                                        >
                                            {/* {Array.isArray(fieldlist) &&
                                                fieldlist.map((option) => (
                                                    <MenuItem key={option._id} value={option.Field}>
                                                        {option.Field}
                                                    </MenuItem>
                                                ))} */}

                                            {Array.isArray(fieldlist) &&
                                                fieldlist.map((option) => (
                                                    <MenuItem key={option._id} value={option.Field} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>{option.Field}</span>
                                                        <IconButton
                                                            aria-label="delete"
                                                            size="small"
                                                            onClick={() => handleDimDelete(option._id)}
                                                            style={{ marginLeft: 'auto', width: '24px' }}  // Adjust the width as needed
                                                        >
                                                            <DeleteIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </MenuItem>
                                                ))}

                                        </TextField>

                                        <IconButton onClick={handleDialogOpen3} color="primary" style={{ marginLeft: '20px' }}>
                                            <AddIcon />
                                        </IconButton>
                                        {Array.isArray(dimensionOptions) && dimensionOptions.length >= 0 && setFieldStatus === "Multi Field" && setFieldStatus !== "Single Field" && (
                                            <><div style={{ marginLeft: '20px' }}>
                                                <TextField
                                                    id="outlined-select-dimensions"
                                                    select
                                                    label="Select Field 2"
                                                    style={{ minWidth: '240px', paddingRight: '8px' }}
                                                    color="success"
                                                    onChange={(e) => setSelectedDimension(e.target.value)}
                                                >
                                                    {dimensionOptions.map((dimension) => (
                                                        <MenuItem key={dimension._id} value={dimension.Dimension} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <span>{dimension.Dimension}</span>
                                                            <IconButton
                                                                aria-label="delete"
                                                                size="small"
                                                                onClick={() => handleDimDelete1(dimension._id)}
                                                                style={{ marginLeft: 'auto', width: '24px' }}  // Adjust the width as needed
                                                            >
                                                                <DeleteIcon fontSize="inherit" />
                                                            </IconButton>
                                                        </MenuItem>
                                                    ))}

                                                </TextField>
                                            </div><IconButton onClick={handleDialogOpen} color="primary" style={{ marginLeft: '20px' }}>
                                                    <AddIcon />
                                                </IconButton></>
                                        )}


                                    </div>


                                </div>
                                <div style={{ paddingLeft: '237px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <TextField
                                            label="Value1"
                                            value={inputValuedi}
                                            onChange={(e) => setInputValuedi(e.target.value)}
                                            style={{ marginLeft: '20px', paddingRight: '60px' }} />

                                        {setFieldStatus.length > 0 && selectedimension.length > 0 && selectedimension !== "Color" && selectedimension !== "POT" && (
                                            (() => {
                                                if (setFieldStatus === "Multi Field" && setFieldStatus !== "Single Field") {
                                                    return (
                                                        <TextField
                                                            label="Value2"
                                                            value={inputValued2}
                                                            onChange={(e) => setInputValued2(e.target.value)}
                                                            style={{ marginLeft: '40px', paddingRight: '20px' }} />
                                                    );
                                                }
                                                else {
                                                    return null; // Hide the TextField when conditions are not met
                                                }
                                            })()
                                        )}


                                        {selectedimension.length > 0 && (
                                            (() => {
                                                if (selectedimension === "Color" && setFieldStatus === "Multi Field" && setFieldStatus !== "Single Field") {
                                                    return (
                                                        <>
                                                            <div style={{ marginLeft: '20px' }}>
                                                                <TextField
                                                                    id="outlined-select-dimensions"
                                                                    select
                                                                    style={{ minWidth: '200px', marginLeft: '20px', paddingRight: '20px' }}
                                                                    color="success"
                                                                    onChange={(e) => setselectedcolors(e.target.value)}
                                                                >
                                                                    {Array.isArray(colorslist) &&
                                                                        colorslist.map((dimension) => (
                                                                            <MenuItem key={dimension._id} value={dimension.Color}>
                                                                                {dimension.Color}
                                                                            </MenuItem>
                                                                        ))}
                                                                </TextField>
                                                            </div>
                                                            <div>
                                                                <IconButton onClick={handleDialogOpen2} color="primary" style={{ marginLeft: '20px' }}>
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </div>
                                                        </>
                                                    );
                                                }
                                                return null;
                                            })()
                                        )}

                                        {selectedimension.length > 0 && (
                                            (() => {
                                                if (selectedimension === "POT" && setFieldStatus === "Multi Field" && setFieldStatus !== "Single Field") {
                                                    return (
                                                        <>
                                                            <div style={{ marginLeft: '20px' }}>
                                                                <TextField
                                                                    id="outlined-select-dimensions"
                                                                    select
                                                                    style={{ minWidth: '200px', marginLeft: '20px', paddingRight: '20px' }}
                                                                    color="success"
                                                                    onChange={(e) => setSelectedPots1(e.target.value)}
                                                                >
                                                                    {Array.isArray(PotNames) &&
                                                                        PotNames.map((dimension) => (
                                                                            <MenuItem key={dimension._id} value={dimension.name}>
                                                                                {dimension.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                </TextField>
                                                            </div>
                                                            <div>
                                                                {/* <IconButton onClick={handleDialogOpen2} color="primary" style={{ marginLeft: '20px' }}>
                            <AddIcon />
                        </IconButton> */}
                                                            </div>
                                                        </>
                                                    );
                                                }
                                                return null;
                                            })()
                                        )}


                                        <TextField
                                            label="Price"
                                            value={inputValuePrice}
                                            onChange={(e) => setInputValuePrice(e.target.value)}
                                            style={{ marginLeft: '20px', paddingLight: '30px' }} />

                                        <Button onClick={handleSubmitDim} color="primary" style={{ marginLeft: '20px' }}>
                                            Add to List
                                        </Button>
                                    </div>

                                    {/* Your 'Add' button can trigger the modal or other actions */}
                                </div>

                            </div>


                            {/* Dialog for adding new Fields */}
                            <Dialog open={isDialogOpen3} onClose={handleDialogClose3}>
                                <DialogTitle>Add New Fields</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="Field"
                                        value={field}
                                        onChange={handleFieldChange} />


                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDialogClose3}>Cancel</Button>
                                    {/* Use the 'Submit' button to submit the details */}
                                    <Button onClick={handleInsertField} color="primary">
                                        Add
                                    </Button>
                                </DialogActions>
                            </Dialog>


                            {/* Dialog for adding new option */}
                            <Dialog open={isDialogOpen2} onClose={handleDialogClose2}>
                                <DialogTitle>Add New Color</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="Color"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)} />


                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDialogClose2}>Cancel</Button>
                                    {/* Use the 'Submit' button to submit the details */}
                                    <Button onClick={addColor} color="primary">
                                        Add
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            {/* Dialog for adding new option */}
                            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                                <DialogTitle>Add New Option</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="Value"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)} />
                                    <div style={{ paddingTop: '20px' }}> <TextField
                                        label="Category"
                                        select
                                        value={selectedCategoryDim}
                                        onChange={(e) => setSelectedCategoryDim(e.target.value)}

                                    >
                                        {Array.isArray(fieldlist) &&
                                            fieldlist.map((option) => (
                                                <MenuItem key={option._id} value={option.Field}>
                                                    {option.Field}
                                                </MenuItem>
                                            ))}
                                    </TextField></div>

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
                            {/* {dataList.map((item, index) => (
        <div key={index} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1">
                <div>{`${item.Field1},${item.Value1},${item.Field2},${item.Value2}, -${item.Price}`}</div>


            </Typography>
            <IconButton
                className="dlt-btn" // Add your custom class here
                onClick={() => handleDeleteItem(index)}
                color="secondary"
                style={{ marginLeft: '10px' }}
            >
                <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }} />
            </IconButton>

        </div>
    ))} */}

                            <div>
                                {details.length > 0 ? (
                                    details.map((detail) => (
                                        <div key={detail._id} style={{ display: 'flex', alignItems: 'center' }}>
                                            <p>
                                                {detail.Field1}:{detail.Value1}, {detail.Field2}:{detail.Value2} - Price: {detail.Price}
                                            </p>
                                            <IconButton
                                                className="dlt-btn" // Add your custom class here
                                                onClick={() => deleteProduct(detail._id)}
                                                color="secondary"
                                                style={{ marginLeft: '10px' }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }} />
                                            </IconButton>
                                        </div>
                                    ))
                                ) : (
                                    <p>No details available</p>
                                )}

                            </div>

                            {/* Submit button */}
                            {/* <Button onClick={handleSubmitDim} color="primary" variant="contained" style={{ marginTop: '20px' }}>
        Submit
    </Button> */}
                        </div>




                        <div className='features-div'>
                            <span>Features</span>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Select
                                    isMulti
                                    options={featureNames.map((name) => ({ value: name.name, label: name.name }))}
                                    value={selectedFeatures}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '53px',
                                            minWidth: '340px',
                                        }),
                                    }}
                                    onChange={(selectedOptions) => {
                                        handleFeatureChange(selectedOptions);
                                    }} /> <IconButton onClick={handleOpenDialog} style={{ borderRadius: '50%' }}>
                                    <AddIcon style={{ color: 'black' }} />
                                </IconButton>
                            </div>
                        </div>


                        <div className='plant-care-div'>
                            <span>Product Care</span>
                            <div className='form'>

                                <div className='plantcares-div'>

                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        style={{ paddingLeft: '0px', minWidth: '340px' }} // Adjust the width as needed
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
                                        <div className='care-btn-img' style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                            <img
                                                src={plantcareData.image}
                                                alt="plantcare"
                                                style={{ width: '60px', height: '45px', objectFit: 'contain', borderRadius: '30%', marginRight: '20px' }} />
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
                                        <button onClick={uploadProductcarelist} type='button' className='btn plantcare-btn'>  ADD </button> </div>
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
                                                onChange={(e) => setPlantcareData({ ...plantcareData, description: e.target.value })} />

                                        </div>
                                    )}</div>

                                <div className='plantcare-show-list'>


                                    <div className='selected-plantcare'>

                                        {selectecarelist && <span>Plant Care List:</span>}
                                        <ul>
                                            {selectecarelist.map((careName, index) => (
                                                <li key={index}>
                                                    <p>{careName.careName}</p>
                                                    <button className='dlt-btn'
                                                        onClick={() => handleDeleteCareName(careName.subcategory, careName.title, careName.careName)}
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
                    {message && <p className="message">{message}</p>}
                </Wrapper>
            </div >
            {/* Add Feature Dialog */}
            < Dialog open={openDialog} onClose={handleCloseDialog} >
                <DialogTitle>Add New Feature</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Feature"
                        variant="outlined"
                        fullWidth
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog >


            {/* Add ADD LENGTH Dialog */}
            < Dialog open={openDialog2} onClose={handleCloseDialog2} >
                <DialogTitle>Add New Length</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Length"
                        variant="outlined"
                        fullWidth
                        value={Addname} onChange={handleADDNameChange} />


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog2}>Cancel</Button>
                    <Button onClick={handleLengthSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog >

        </div ></>
    );
};

export default OtherProducts;

