import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem } from '@mui/material';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const StockCategory = () => {

    useEffect(() => {
        fetchCategories();
        fetchProductDetails();
    }, []);

    const [productDetails, setProductDetails] = useState([]); // To store product details

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
    const handleClick =()=>{
        fetchProductDetails();
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
        fetchProductDetails();
    };

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newStock, setNewStock] = useState('');


    const handleEditStockClick = (product) => {
        setSelectedProduct(product);
        setNewStock(product.stock.toString()); // Set the current stock in the dialog input
        setEditStockDialogOpen(true);
        
    };

    const handleEditStockSubmit = async () => {
        if (!selectedProduct || !newStock) {
            // Validation: Ensure product and stock are selected
            return;
            fetchProductDetails();
        }
        

        try {
            const updatedProduct = { ...selectedProduct, stock: parseInt(newStock) };
            await axios.put(`${process.env.REACT_APP_BASE_URL}/updateProductStock/${updatedProduct._id}`, {
                stock: updatedProduct.stock,
            });

            // Close the dialog and update the stock in the table
            setEditStockDialogOpen(false);

        } catch (error) {
            console.error('Error updating stock:', error);
        }
        fetchProductDetails();
    };
    const [editStockDialogOpen, setEditStockDialogOpen] = useState(false);

    return (
        <><div className='formFour' >
            <div>
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
                        onClick={() => handlesubcategorySelect2(option.name)}>
                        {option.name}
                    </MenuItem>
                ))}
            </TextField> <div style={{paddingRight:'50px'}} >
                
            <Button onClick={fetchProductDetails}>Go</Button>
            </div>
            </div>
                {/* Your category selection code here */}
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <div className="product-details" style={{paddingTop:'20px'}}>
                           
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ background: 'lightgreen', fontWeight: 'bold', fontSize: '25px' }}>
                                            <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Title</TableCell>
                                            <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Main Category</TableCell>
                                            <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Category</TableCell>
                                            <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Subcategory</TableCell>
                                            <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Price</TableCell>
                                            <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Stock</TableCell>
                                            <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productDetails.map((product) => (
                                            <TableRow key={product._id}>
                                                <TableCell>{product.title}</TableCell>
                                                <TableCell>{product.maincategory}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>{product.subcategory}</TableCell>
                                                <TableCell>{product.price}</TableCell>
                                                <TableCell>{product.stock}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleEditStockClick(product)}
                                                    >
                                                        Edit Stock
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Grid>
                </Grid>
            </div>

            {/* Edit Stock Dialog */}
            <Dialog 
                open={editStockDialogOpen}
                onClose={() => setEditStockDialogOpen(false)}
            >
                <DialogTitle>Edit Stock</DialogTitle>
                <DialogContent >
                    <div style={{paddingTop:'20px'}}>
                    <TextField
                    
                        label="New Stock"
                        variant="outlined"
                        fullWidth
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                    /></div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditStockDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditStockSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog></>

    )
}

export default StockCategory
