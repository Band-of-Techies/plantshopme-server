import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem ,CircularProgress} from '@mui/material';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import fetchData from './FlashSalesData'
import { ToastContainer, toast } from 'react-toastify';
import FlashSalesData from './FlashSalesData';
const ProductSelection = () => {

    useEffect(() => {
        setIsLoading(true);
        fetchCategories();
        setTimeout(() => {
            fetchProductDetails();
            setIsLoading(false);
        }, 400);
        
    }, []);

    const [productDetails, setProductDetails] = useState([]); // To store product details
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetchCategories();
        fetchProductDetails();
    }, []);

    // ... Rest of your code for fetching categories

    const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getProductDetails/${selectedCategory}/${selectedsubCategory}/${selectedsubCategory2}`);
          if (response.status === 200) {
            setProductDetails(response.data);
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

    {/**************PRODUCT CATEGORY********************/ }
    const [mainCategory, setMainCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedsubCategory, setSelectedsubCategory] = useState(null);
    const [selectedsubCategory2, setSelectedsubCategory2] = useState(null);
    const [selectedProduct,setSelectedProduct]=useState(null);
    const [selectedProductId,setSelectedProductId]=useState(null);

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
        fetchProductDetails();
    }
    const handleClick = () => {
        fetchProductDetails();
    }

    const handleselectedProduct=(productName,ProductId)=>{
        setSelectedProduct(productName);
        setSelectedProductId(ProductId);

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

    const handleButtonClick = () => {
        setIsLoading(true);
        // Check if all required fields are selected
        if (selectedProductId && selectedProduct && selectedsubCategory) {
          // Send the selected product details to the backend
          axios.post(`${process.env.REACT_APP_BASE_URL}/flash-sales`, {
            ProductId: selectedProductId,
            ProductName: selectedProduct,
            SubCategory: selectedsubCategory,
          })
          .then((response) => {
            toast.success('Product sale data sent successfully Please Refresh');
            // Redirect to the product details page or update the UI as needed
          })
          .catch((error) => {
            toast.error('Error sending product sale data:', error);
          });
        } else {
          toast.error('Not all required fields are selected.');
          // Handle the case where not all required fields are selected
        }
       
        
       
      };
    

    return (
        <div>
            <div className='single'>
               
                <div className='singleContainer'>
                   
<ToastContainer/>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select"

                        helperText="Please select Main Category"
                        style={{ paddingRight: '5px' }}
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

                        helperText="Please select Category"
                        style={{ paddingRight: '5px' }}
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

                        helperText="Please select SubCategory"
                        style={{ paddingRight: '80px' }}
                    >
                        {subcategories.map((option) => (
                            <MenuItem key={option.name} value={option.name}
                                onClick={() => handlesubcategorySelect2(option.name,option.id)}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                id="outlined-select-currency"
                select
                label="Select"

                helperText="Please select SubCategory"
                style={{ paddingRight: '80px' }}
            >
                {productDetails.map((option) => (
                    <MenuItem key={option.id} value={option.title}
                        onClick={() => handleselectedProduct(option.title,option._id)}
                        >
                        {option.title}
                    </MenuItem>
                ))}
            </TextField>

            <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
      >
        ADD To FLASH SALE
      </Button>
                </div>
            </div>
         
            <FlashSalesData  />
        </div>
    )
}

export default ProductSelection
