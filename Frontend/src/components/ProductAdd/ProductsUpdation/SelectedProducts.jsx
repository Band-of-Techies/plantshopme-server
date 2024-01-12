import React, { useEffect, useState } from 'react';
import { TextField, MenuItem } from '@mui/material';
import axios from 'axios';

const SelectedProduct = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [mainCategory, setMainCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedsubCategory, setSelectedsubCategory] = useState(null);
  const [selectedsubCategory2, setSelectedsubCategory2] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProductDetails();
  }, [selectedCategory, selectedsubCategory, selectedsubCategory2]);

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

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    fetchSubcategories(categoryName);
    fetchSubcategories2(categoryName);
  };

  const handlesubcategorySelect = (categoryName) => {
    fetchSubcategories2(categoryName);
    setSelectedsubCategory(categoryName);
  };

  const handlesubcategorySelect2 = (categoryName) => {
    setSelectedsubCategory2(categoryName);
  };

  const handleselectedProduct = (productName, ProductId) => {
    setSelectedProduct(productName);
    setSelectedProductId(ProductId);
    localStorage.setItem('selectedProductName', productName);
    localStorage.setItem('selectedProductId', ProductId);
    localStorage.setItem('selectedmaincategory', selectedCategory);
    localStorage.setItem('selectedcategory', selectedsubCategory);
    localStorage.setItem('selectedsubcategory', selectedsubCategory2);
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

  return (
    <div>
      <div className='single' style={{ padding: '7px' }}>
        <div className='singleContainer'>
          <TextField
            id='outlined-select-currency'
            select
            label='Select'
            helperText='Please select Main Category'
            style={{ paddingRight: '5px' }}
          >
            {mainCategory.map((option) => (
              <MenuItem
                key={option.name}
                value={option.name}
                onClick={() => handleCategorySelect(option.name)}
              >
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label='Select'
            helperText='Please select Category'
            style={{ paddingRight: '5px' }}
          >
            {categories.map((option) => (
              <MenuItem
                key={option.name}
                value={option.name}
                onClick={() => handlesubcategorySelect(option.name)}
              >
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id='outlined-select-currency'
            select
            label='Select'
            helperText='Please select SubCategory'
            style={{ paddingRight: '80px' }}
          >
            {subcategories.map((option) => (
              <MenuItem
                key={option.name}
                value={option.name}
                onClick={() => handlesubcategorySelect2(option.name)}
              >
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id='outlined-select-currency'
            select
            label='Select'
            helperText='Please select SubCategory'
            style={{ paddingRight: '80px' }}
          >
            {productDetails.map((option) => (
              <MenuItem
                key={option.id}
                value={option.title}
                onClick={() => handleselectedProduct(option.title, option._id)}
              >
                {option.title}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
    </div>
  );
};

export default SelectedProduct;
