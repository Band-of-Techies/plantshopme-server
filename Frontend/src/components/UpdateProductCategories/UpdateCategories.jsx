import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { Checkbox, FormControlLabel, FormGroup, Grid, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { TextField, Button, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

const UpdateCategories = () => {
  const [productName, setProductName] = useState('');
  const [SKU, setSKU] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [error, setError] = useState('');
  const [productid,setproductId]=useState('');
  const [mainCategorynew, setMainCategorynew] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [thirdCategory, setThirdCategory] = useState([]);
  const [selectedThirdCategories, setSelectedThirdCategories] = useState([]);

  const fetchCategoriesnew = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getMainCategories`);
      setMainCategorynew(response.data);
      fetchSubCategories([]);
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

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getCategoriesByParent?${params.toString()}`);
      setSubCategory(response.data);
      setThirdCategory([]);
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
        params.append('subCategory', category);
      });

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getThirdCategoriesBySub?${params.toString()}`);
      setThirdCategory(response.data);
    } catch (error) {
      // toast.error('Error fetching Third categories:', error);
    }
  };

  useEffect(() => {
    fetchCategoriesnew();
  }, []);

  useEffect(() => {
    fetchSubCategories(selectedCategories);
  }, [selectedCategories]);

  const handleMainCategoryChange = (event) => {
    const { name } = event.target;
    const updatedSelectedCategories = event.target.checked
      ? [...selectedCategories, name]
      : selectedCategories.filter((category) => category !== name);

    setSelectedCategories(updatedSelectedCategories);
  };

  useEffect(() => {
    fetchCategoriesnew();
    handleSearch();
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

  const handleSearch = async () => {

    const productName  = localStorage.getItem('PNAMES');

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getProductDetails`, {
        params: { productName, SKU },
      });

      const { maincategory, category, subcategory ,_id} = response.data;

      setproductId(_id || '')
      setMainCategory(maincategory || '');
      setCategory(category || '');
      setSubcategory(subcategory || '');
      setError('');

      // Automatically check the matching categories
      setSelectedCategories(maincategory || []);
      setSelectedSubCategories(category || []);
      setSelectedThirdCategories(subcategory || []);
    } catch (error) {
      setMainCategory('');
      setCategory('');
      setSubcategory('');
      setError('Product not found');
    }
  };

  const handleUpdateCategories = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/updateCategories/${productid}`,
        {
          maincategory: [...selectedCategories],
          category: [...selectedSubCategories],
          subcategory: [...selectedThirdCategories],
        }
      );
  
      console.log('After Update - Response:', response.data);
  
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating categories:', error);
      toast.error('Error updating categories');
    }
  };
  
  

  return (
    
    <div className='single'>
     
      <div className='singleContainer'>
       
        <Wrapper>
          <ToastContainer/>
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
  
 

  {error && (
    <Typography variant="subtitle1" color="error" style={{ marginRight: '10px' }}>
      {error}
    </Typography>
  )}

  <div>
    
  </div>
</div>


          <div>
            <h4>Product categories</h4>
            <div className='formFour'>
              <Container>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormGroup>
                      {mainCategorynew.map((category) => (
                        <FormControlLabel
                          key={category.id}
                          control={<Checkbox name={category.name} onChange={handleMainCategoryChange} checked={selectedCategories.includes(category.name)} />}
                          label={category.name}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={4}>
                    <FormGroup>
                      {subCategory.map((category) => (
                        <FormControlLabel
                          key={category.id}
                          control={<Checkbox name={category.name} onChange={handleSubCategoryChange} checked={selectedSubCategories.includes(category.name)} />}
                          label={category.name}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={4}>
                    <FormGroup>
                      {thirdCategory.map((category) => (
                        <FormControlLabel
                          key={category.id}
                          control={<Checkbox name={category.name} onChange={handleThirdCategoryChange} checked={selectedThirdCategories.includes(category.name)} />}
                          label={category.name}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                </Grid>
              </Container>
            </div>
          </div>

          <Button variant="contained" onClick={handleUpdateCategories}>
            Update Categories
          </Button>

        </Wrapper>
      </div>
    </div>
  );
};

export default UpdateCategories;



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