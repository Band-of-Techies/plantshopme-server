import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Container, Grid, Button } from '@mui/material';

const CategoryList = () => {
  const [mainCategorynew, setMainCategorynew] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [thirdCategory, setThirdCategory] = useState([]);
  const [selectedThirdCategories, setSelectedThirdCategories] = useState([]);


  const handleSubmit = async () => {
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
        console.log('Categories successfully inserted:', data.insertedCategories);
        // Optionally, reset the selected categories after successful insertion
        setSelectedCategories([]);
        setSelectedSubCategories([]);
        setSelectedThirdCategories([]);
      } else {
        console.error('Failed to insert categories');
      }
    } catch (error) {
      console.error('Error submitting categories:', error);
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
      console.error('Error fetching Main categories:', error);
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
      console.error('Error fetching Sub categories:', error);
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
      console.error('Error fetching Third categories:', error);
    }
  };

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

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormGroup>
            {mainCategorynew.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    name={category.name}
                    onChange={handleMainCategoryChange}
                    checked={selectedCategories.includes(category.name)}
                  />
                }
                label={category.name}
              />
            ))}
          </FormGroup>
          <div>
            <strong>Selected Main Categories:</strong> {selectedCategories.join(', ')}
          </div>
        </Grid>
        <Grid item xs={4}>
          <FormGroup>
            {subCategory.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    name={category.name}
                    onChange={handleSubCategoryChange}
                    checked={selectedSubCategories.includes(category.name)}
                  />
                }
                label={category.name}
              />
            ))}
          </FormGroup>
          <div>
            <strong>Selected Sub Categories:</strong> {selectedSubCategories.join(', ')}
          </div>
        </Grid>
        <Grid item xs={4}>
          <FormGroup>
            {thirdCategory.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    name={category.name}
                    onChange={handleThirdCategoryChange}
                    checked={selectedThirdCategories.includes(category.name)}
                  />
                }
                label={category.name}
              />
            ))}
          </FormGroup>
          <div>
            <strong>Selected Third Categories:</strong> {selectedThirdCategories.join(', ')}
          </div>
        </Grid>
      </Grid>
      <div>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit
      </Button>
      </div>
    </Container>
  );
};

export default CategoryList;
