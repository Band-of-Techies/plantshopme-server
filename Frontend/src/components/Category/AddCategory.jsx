import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Main from '../Main';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import '../Category/Addcategory.css'; // Import your CSS file for styling
import Home from '../../pages/home/Home';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import '../Category/single.scss';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Wrapper } from './Wrapper'
import { ToastContainer, toast } from 'react-toastify';
import { FormControl, InputLabel, Input, CircularProgress } from '@mui/material';

function AddCategory() {

  const [mainCategory, setMainCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategories2, setSubcategories2] = useState([]);
  // New category
  const [newCategory, setNewCategory] = useState('');


  const [show, setShow] = useState(false)


  // New subcategory
  const [newSubCategory, setNewSubCategory] = useState('');

  // State to track whether the dialog is open or not
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [categoryId, setCategoryId] = useState(null);


  //add main category icons 


  const [selectedIconFile, setSelectedIconFile] = useState(null);

  const handleIconFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedIconFile(file);
  };


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getMainCategories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching Main categories:', error);
    }
  };

  const fetchSubcategories = async (parentCategory) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getCategoriesByParent/${parentCategory}`);
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories2 = async (parentCategory, category) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getSubcategories/${parentCategory}/${category}`);
      if (response.ok) {
        const data = await response.json();
        setSubcategories2(data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCategorySelect = (categoryName) => {

    setSelectedCategory(categoryName);
    fetchSubcategories(categoryName);
    fetchSubcategories2(categoryName);
  };

  const handleSubcategorySelect = (subcategoryName) => {
    setSelectedSubcategory(subcategoryName);
    // Fetch subcategories2 here based on selectedCategory and subcategoryName
    fetchSubcategories2(selectedCategory, subcategoryName);
  };

  
// const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if the mainCategory already exists in categories
//     if (categories.some(category => category.name === mainCategory)) {
//       toast.error('Category already exists.');
//       setSuccessMessage('');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('name', mainCategory);
//       formData.append('image', selectedIconFile); // Add the selected icon file to the form data
//       const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addMainCategory`, {
//         method: 'POST',
//         body: formData, // Use form data instead of JSON.stringify

//       });

//       if (response.ok) {
//         // Clear the input field on success
//         setMainCategory('');
//         setSelectedIconFile(null); // Clear the selected icon file
//         setErrorMessage('');
//         toast.success('Category added successfully.');

//         // Add the new category to the categories state
//         setCategories([...categories, { name: mainCategory }]);

//         // Fetch the updated list of categories and update the state
//         await fetchCategories();
//       } else {
//         // Handle any errors here
//         toast.error('Failed to add Main Category PLZ check Icon Added or not');
//         setErrorMessage('Failed to add category.');
//         setSuccessMessage('');
//       }
//     } catch (error) {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // Display the error message on the frontend using toast
//         toast.error('Error: ' + error.response.data.error);
//     } else if (error.request) {
//         // The request was made but no response was received
//         toast.error('No response received from the server.');
//     } else {
//         // Something happened in setting up the request that triggered an Error
//         toast.error('Error during request setup: ' + error.message);
//     }
//       setSuccessMessage('');
//     }
//   };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Trim extra spaces after the sentence
  //   const trimmedMainCategory = mainCategory.trim().replace(/\s{2,}/g, ' ');
  
  //   // Check if the mainCategory already exists in categories
  //   if (categories.some(category => category.name === trimmedMainCategory)) {
  //     toast.error('Category already exists.');
  //     setSuccessMessage('');
  //     return;
  //   }
  
  //   try {
  //     const formData = new FormData();
  //     formData.append('name', trimmedMainCategory);
  //     formData.append('image', selectedIconFile); // Add the selected icon file to the form data
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addMainCategory`, {
  //       method: 'POST',
  //       body: formData, // Use form data instead of JSON.stringify
  //     });
  
  //     if (response.ok) {
  //       // Clear the input field on success
  //       setMainCategory('');
  //       setSelectedIconFile(null); // Clear the selected icon file
  //       setErrorMessage('');
  //       toast.success('Category added successfully.');
  
  //       // Add the new category to the categories state
  //       setCategories([...categories, { name: trimmedMainCategory }]);
  
  //       // Fetch the updated list of categories and update the state
  //       await fetchCategories();
  //     } else {
  //       // Handle any errors here
  //       toast.error('Failed to add Main Category PLZ check Icon Added or not');
  //       setErrorMessage('Failed to add category.');
  //       setSuccessMessage('');
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       // Display the error message on the frontend using toast
  //       toast.error('Error: ' + error.response.data.error);
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       toast.error('No response received from the server.');
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       toast.error('Error during request setup: ' + error.message);
  //     }
  //     setSuccessMessage('');
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
  
    // Check if the token exists
    if (!token) {
      // Handle case where token is not present
      toast.error('Token is required.');
      return;
    }
  
    // Trim extra spaces after the sentence
    const trimmedMainCategory = mainCategory.trim().replace(/\s{2,}/g, ' ');
  
    // Check if the mainCategory already exists in categories
    if (categories.some(category => category.name === trimmedMainCategory)) {
      toast.error('Category already exists.');
      setSuccessMessage('');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('name', trimmedMainCategory);
      formData.append('image', selectedIconFile); // Add the selected icon file to the form data
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addMainCategory`, {
        method: 'POST',
        headers: {
          'Authorization': `${token}`, // Include the token in the Authorization header
        },
        body: formData, // Use form data instead of JSON.stringify
      });
  
      if (response.ok) {
        // Clear the input field on success
        setMainCategory('');
        setSelectedIconFile(null); // Clear the selected icon file
        setErrorMessage('');
        toast.success('Category added successfully.');
  
        // Add the new category to the categories state
        setCategories([...categories, { name: trimmedMainCategory }]);
  
        // Fetch the updated list of categories and update the state
        await fetchCategories();
      } else {
        // Handle any errors here
        toast.error('Failed to add Main Category. Please check if the icon is added or not.');
        setErrorMessage('Failed to add category.');
        setSuccessMessage('');
      }
    } catch (error) {
      // Handle error
      toast.error('Error occurred: ' + error.message);
      setSuccessMessage('');
    }
  };
  
  // const handleSubmit2 = async (e) => {
  //   e.preventDefault();
  //   if (subcategories.some(subcategory => subcategory.name === newCategory)) {
  //     toast.error('Category already exists.');
  //     setSuccessMessage('');
  //     return;
  //   }
  //   // Check if the newCategory name is empty
  //   if (!newCategory.trim()) {
  //     toast.error('Category name cannot be empty.');
  //     setSuccessMessage('');
  //     return;
  //   }

  //   if (!selectedCategory) {
  //     toast.error('Please select a parent category.');
  //     setSuccessMessage('');
  //     return;
  //   }

  //   try {
  //     // Send a POST request to your Express API to add a new subcategory
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addCategory`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ name: newCategory, parentCategory: selectedCategory }),
  //     });

  //     if (response.ok) {
  //       // Clear the input field on success
  //       setNewCategory('');
  //       setErrorMessage('');
  //       toast.success('Category added successfully.');

  //       // Add the new subcategory to the subcategories state
  //       setSubcategories([...subcategories, { name: newCategory }]);

  //       // Fetch the updated list of categories and update the state
  //       await fetchCategories();
  //     } else {
  //       // Handle any errors here
  //       console.error('Failed to add Category');
  //       toast.error('Failed to add category.');
  //       setSuccessMessage('');
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       // Display the error message on the frontend using toast
  //       toast.error('Error: ' + error.response.data.error);
  //   } else if (error.request) {
  //       // The request was made but no response was received
  //       toast.error('No response received from the server.');
  //   } else {
  //       // Something happened in setting up the request that triggered an Error
  //       toast.error('Error during request setup: ' + error.message);
  //   }
  //     setSuccessMessage('');
  //   }
  // };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (subcategories.some(subcategory => subcategory.name === newCategory)) {
      toast.error('Category already exists.');
      setSuccessMessage('');
      return;
    }
    // Check if the newCategory name is empty
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty.');
      setSuccessMessage('');
      return;
    }

    if (!selectedCategory) {
      toast.error('Please select a parent category.');
      setSuccessMessage('');
      return;
    }

    // Trim extra spaces after the sentence
    const trimmedNewCategory = newCategory.trim().replace(/\s{2,}/g, ' ');

    try {
      // Send a POST request to your Express API to add a new subcategory
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedNewCategory, parentCategory: selectedCategory }),
      });

      if (response.ok) {
        // Clear the input field on success
        setNewCategory('');
        setErrorMessage('');
        toast.success('Category added successfully.');

        // Add the new subcategory to the subcategories state
        setSubcategories([...subcategories, { name: trimmedNewCategory }]);

        // Fetch the updated list of categories and update the state
        await fetchCategories();
      } else {
        // Handle any errors here
        console.error('Failed to add Category');
        toast.error('Failed to add category.');
        setSuccessMessage('');
      }
    } catch (error) {
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
      setSuccessMessage('');
    }
  };


  // const handleSubmit3 = async (e) => {
  //   e.preventDefault();
  //   if (subcategories2.some(category => category.name === newSubCategory)) {
  //     toast.error('Category already exists.');
  //     setSuccessMessage('');
  //     return;
  //   }
  //   if (!newSubCategory.trim()) {
  //     toast.error('Subcategory name cannot be empty.');
  //     setSuccessMessage('');
  //     return;
  //   }

  //   if (!selectedCategory || !selectedSubcategory) {
  //     toast.error('Please select both parent category and subcategory.');
  //     setSuccessMessage('');
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/subCategory`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         name: newSubCategory,
  //         parentCategory: selectedCategory,
  //         Category: selectedSubcategory,
  //       }),
  //     });

  //     if (response.ok) {
  //       setNewSubCategory('');
  //       setErrorMessage('');
  //       toast.success('Subcategory added successfully.');

  //       // Add the new subcategory to both subcategories and subcategories2 states
  //       // setSubcategories([...subcategories, { name: newSubCategory }]);
  //       setSubcategories2([...subcategories2, { name: newSubCategory }]);

  //       // Fetch the updated list of categories and update the state
  //       // await fetchCategories();
  //     } else {
  //       console.error('Failed to add Subcategory');
  //       toast.error('Failed to add subcategory.');
  //       setSuccessMessage('');
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       // Display the error message on the frontend using toast
  //       toast.error('Error: ' + error.response.data.error);
  //   } else if (error.request) {
  //       // The request was made but no response was received
  //       toast.error('No response received from the server.');
  //   } else {
  //       // Something happened in setting up the request that triggered an Error
  //       toast.error('Error during request setup: ' + error.message);
  //   }
  //     setSuccessMessage('');
  //   }
  // };

  // Function to open the dialog for editing Main category
  
  const handleSubmit3 = async (e) => {
    e.preventDefault();
    if (subcategories2.some(category => category.name === newSubCategory)) {
      toast.error('Category already exists.');
      setSuccessMessage('');
      return;
    }
    if (!newSubCategory.trim()) {
      toast.error('Subcategory name cannot be empty.');
      setSuccessMessage('');
      return;
    }
  
    if (!selectedCategory || !selectedSubcategory) {
      toast.error('Please select both parent category and subcategory.');
      setSuccessMessage('');
      return;
    }
  
    // Trim extra spaces after the sentence
    const trimmedNewSubCategory = newSubCategory.trim().replace(/\s{2,}/g, ' ');
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/subCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedNewSubCategory,
          parentCategory: selectedCategory,
          Category: selectedSubcategory,
        }),
      });
  
      if (response.ok) {
        setNewSubCategory('');
        setErrorMessage('');
        toast.success('Subcategory added successfully.');
  
        // Add the new subcategory to both subcategories and subcategories2 states
        // setSubcategories([...subcategories, { name: trimmedNewSubCategory }]);
        setSubcategories2([...subcategories2, { name: trimmedNewSubCategory }]);
  
        // Fetch the updated list of categories and update the state
        // await fetchCategories();
      } else {
        console.error('Failed to add Subcategory');
        toast.error('Failed to add subcategory.');
        setSuccessMessage('');
      }
    } catch (error) {
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
      setSuccessMessage('');
    }
  };
  
  
  const openDialog = () => {
    setIsDialogOpen(true);

  };

  const openDialog1 = () => {
    setIsDialogOpen1(true);
  };

  const openDialog2 = () => {
    setIsDialogOpen2(true);
  };

  // Function to open the dialog for editing category

  // Function to close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const closeDialog1 = () => {
    setIsDialogOpen1(false);
  };
  const closeDialog2 = () => {
    setIsDialogOpen2(false);
  };

  // Function to handle category update
  // const handleCategoryUpdate = async () => {
  //   try {
  //     // Send a PUT request to update the category
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/MainCategory/${categoryId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ name: selectedCategory }),
  //     });

  //     if (response.ok) {
  //       setErrorMessage('');
  //       toast.success('Category updated successfully.');

  //       // Fetch the updated list of categories and update the state
  //       await fetchCategories();
  //       closeDialog();
  //     } else {
  //       // Handle any errors here
  //       console.error('Failed to update Category');
  //       toast.error('Failed to update category.');
  //       setSuccessMessage('');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     toast.error('Error occurred while updating category.',error);
  //     setSuccessMessage('');
  //   }
  // };


  // const handleCategoryUpdate = async () => {
  //   try {
  //     setIsLoading(true);

  //     const formData = new FormData();
  //     formData.append('name', selectedCategory);
  //     formData.append('photo', selectedImage);

  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/MainCategory/${categoryId}`, {
  //       method: 'PUT',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       setErrorMessage('');
  //       toast.success('Category updated successfully.');

  //       await fetchCategories();
  //       closeDialog();
  //     } else {
  //       console.error('Failed to update Category');
  //       toast.error('Failed to update category.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     toast.error('Error occurred while updating category.', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleCategoryUpdate = async () => {
    try {
      setIsLoading(true);
  
      // Trim extra spaces after the sentence
      const trimmedSelectedCategory = selectedCategory.trim();
  
      const formData = new FormData();
      formData.append('name', trimmedSelectedCategory);
      formData.append('photo', selectedImage);
  
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/MainCategory/${categoryId}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        setErrorMessage('');
        toast.success('Category updated successfully.');
  
        await fetchCategories();
        closeDialog();
      } else {
        console.error('Failed to update Category');
        toast.error('Failed to update category.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred while updating category.', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // const handleCategoryUpdate1 = async () => {
  //   try {
  //     // Send a PUT request to update the category
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/updateCategory/${categoryId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ name: selectedCategory, }),
  //     });

  //     if (response.ok) {
  //       setErrorMessage('');
  //       toast.success('Category updated successfully.');

  //       // Fetch the updated list of categories and update the state
  //       await fetchSubcategories();
  //       closeDialog1();
  //     } else {
  //       // Handle any errors here
  //       console.error('Failed to update Category');
  //       toast.error('Failed to update category.');
  //       setSuccessMessage('');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     toast.error('Error occurred while updating category.', error);
  //     setSuccessMessage('');
  //   }
  // };

  const handleCategoryUpdate1 = async () => {
    try {
      // Trim extra spaces after the sentence
      const trimmedSelectedCategory = selectedCategory.trim();
  
      // Send a PUT request to update the category
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/updateCategory/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedSelectedCategory }),
      });
  
      if (response.ok) {
        setErrorMessage('');
        toast.success('Category updated successfully.');
  
        // Fetch the updated list of categories and update the state
        await fetchSubcategories();
        closeDialog1();
      } else {
        // Handle any errors here
        console.error('Failed to update Category');
        toast.error('Failed to update category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred while updating category.', error);
      setSuccessMessage('');
    }
  };
  

  // const handleCategoryUpdate2 = async () => {
  //   try {
  //     // Send a PUT request to update the category
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/subCategory/${categoryId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ name: selectedCategory }),
  //     });

  //     if (response.ok) {
  //       setErrorMessage('');
  //       toast.success('Category updated successfully.');
  //       closeDialog2();
  //       // Fetch the updated list of categories and update the state


  //       // Fetch the updated list of categories and update the state
  //       await fetchSubcategories2();

  //     } else {
  //       // Handle any errors here
  //       console.error('Failed to update Category');
  //       toast.error('Failed to update category.');
  //       setSuccessMessage('');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     toast.error('Error occurred while updating category.', error);
  //     setSuccessMessage('');
  //   }
  // };

  // Function to handle category deletion
  
  const handleCategoryUpdate2 = async () => {
    try {
      // Trim extra spaces after the sentence
      const trimmedSelectedCategory = selectedCategory.trim();
  
      // Send a PUT request to update the category
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/subCategory/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedSelectedCategory }),
      });
  
      if (response.ok) {
        setErrorMessage('');
        toast.success('Category updated successfully.');
        closeDialog2();
        // Fetch the updated list of categories and update the state
        await fetchSubcategories2();
      } else {
        // Handle any errors here
        console.error('Failed to update Category');
        toast.error('Failed to update category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred while updating category.', error);
      setSuccessMessage('');
    }
  };
  
  
  const handleCategoryDelete = async () => {
    try {
      if (!selectedCategory) {
        toast.error('Please select a category to delete.');
        setSuccessMessage('');
        return;
      }

      // Send a DELETE request to your Express API to delete the category
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/MainCategory/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setErrorMessage('');
        toast.success('Category deleted successfully.');

        // Remove the deleted category from the state
        const updatedCategories = categories.filter(category => category.name !== selectedCategory);
        setCategories(updatedCategories);

        // Close the dialog
        closeDialog();
      } else {
        // Handle any errors here
        console.error('Failed to delete Category');
        toast.error('Failed to delete category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred while deleting category.', error);
      setSuccessMessage('');
    }
  };

  // Function to handle category deletion
  const handleCategoryDelete2 = async () => {
    try {
      if (!selectedCategory) {
        toast.error('Please select a category to delete.');
        setSuccessMessage('');
        return;
      }

      // Send a DELETE request to your Express API to delete the category
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/deleteCategory/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setErrorMessage('');
        toast.success('Category deleted successfully.');

        // Remove the deleted category from the state
        const updatedCategories = categories.filter(category => category.name !== selectedCategory);
        setCategories(updatedCategories);
        await fetchSubcategories();
        // Close the dialog
        closeDialog1();
      } else {
        // Handle any errors here
        console.error('Failed to delete Category');
        toast.error('Failed to delete category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred while deleting category.', error);
      setSuccessMessage('');
    }
  };

  // Function to handle category deletion
  const handleCategoryDelete3 = async () => {
    try {
      if (!selectedCategory) {
        setErrorMessage('Please select a category to delete.');
        setSuccessMessage('');
        return;
      }

      // Send a DELETE request to your Express API to delete the category
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/subCategory2/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setErrorMessage('');
        toast.success('Category deleted successfully.');

        // Remove the deleted category from the state
        const updatedCategories = categories.filter(category => category.name !== selectedCategory);
        setSubcategories2(updatedCategories);

        // Close the dialog
        closeDialog2();
        await fetchSubcategories2();
      } else {
        // Handle any errors here
        console.error('Failed to delete Category');
        toast.error('Failed to delete category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred while deleting category.', error);
      setSuccessMessage('');
    }
  };


  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };


  return (
    <Wrapper>

      <div className='single'>
        <Sidebar />
        <div class='singleContainer'>
          <Navbar />
          <ToastContainer />
          <div style={{ width: '95%', margin: '0 auto', marginTop: '2rem' }}>
            <h3>Add Categories Here</h3>
            <div className='main-div' >
              <Grid item xs={12} sm={6} md={4}>
                <div className='category-div'>
                  <TextField placeholder="Add Main Category" variant="outlined" size="small" color="success" value={mainCategory}
                    onChange={(e) => setMainCategory(e.target.value)} InputProps={{ style: { backgroundColor: '#fff', color: 'green', borderRadius: '5px 0px 0px 5px' }, }} sx={{
                      width: '265px',// Set the desired width here
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'green', // Set the border color when the field is not focused
                        },
                        '&:hover fieldset': {
                          borderColor: 'lightgreen', // Set the border color when the field is focused
                        },
                      },

                    }}
                  />
                  <button type='submit' className='save-btn' onClick={handleSubmit}>Save</button>
                  {/* <IconButton color="success" onClick={handleSubmit}>
                  <PublishRoundedIcon />
                </IconButton> */}

                  <div className='image-show'>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleIconFileChange}
                      id="icon-file-input" />
                    <label htmlFor="icon-file-input" className='lbl' >
                      <IconButton component="span" color="success" size="small">
                        <AddPhotoAlternateOutlinedIcon />
                      </IconButton>
                      Add an image
                    </label>
                    {selectedIconFile &&
                      <div className='image-preview'>
                        <img src={URL.createObjectURL(selectedIconFile)} alt="preview" className='icon-img' />
                        <FontAwesomeIcon icon={faTrash} onClick={() => setSelectedIconFile(null)} className="delete-icon" />
                      </div>
                    }
                  </div >


                  {/* {selectedIconFile && <span>{selectedIconFile.name}</span>} */}
                </div>

                {categories.map((category, index) => (
                  //  console.log((categories[6].photo.url));
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <Avatar
                      alt={category.name}
                      src={category.photo?.url}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: selectedCategory === category.name ? '#228f47' : 'transparent',
                        marginRight: '10px',
                      }}
                    />
                    <Button
                      variant={selectedCategory === category.name ? 'contained' : 'outlined'}
                      style={{
                        width: '240px',
                        borderColor: 'green',
                        backgroundColor: selectedCategory === category.name ? '#228f47' : '#fff',
                      }}
                      sx={{
                        '&:hover': {
                          color: 'lightgreen',
                          borderColor: 'lightgreen',
                        },
                        '&:active': {
                          color: 'white !important',
                          backgroundColor: 'darkgreen',
                        },
                      }}
                      size="small"
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.name}
                    </Button>
                    <IconButton
                      color="success"
                      size="small"
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCategoryId(category._id); // Set the category ID
                        openDialog(); // Open the dialog when the Edit button is clicked
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                ))}

              </Grid>
              {selectedCategory && <Grid item xs={12} sm={6} md={4}>
                <TextField
                  placeholder="Add Category"
                  variant="outlined"
                  size="small"
                  color='success'
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  InputProps={{
                    style: {
                      color: 'green',
                      borderRadius: '5px 0px 0px 5px',
                      backgroundColor: '#fff',
                    },
                  }}
                  sx={{
                    width: '265px', // Set the desired width here
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'green', // Set the border color when the field is not focused
                      },
                      '&:hover fieldset': {
                        borderColor: 'lightgreen', // Set the border color when the field is focused
                      },
                    },
                  }}
                />
                <button type='submit' className='save-btn' onClick={handleSubmit2}>Save</button>
                {/* <IconButton onClick={handleSubmit2} color='success'>
                  <PublishRoundedIcon />
                </IconButton> */}
                <br /><br /><br />
                {subcategories.map((subcategory, index) => (
                  <div key={index}>
                    <Button
                      variant={selectedSubcategory === subcategory.name ? 'contained' : 'outlined'}
                      style={{
                        marginBottom: '10px',
                        width: '240px',
                        backgroundColor: selectedSubcategory === subcategory.name ? '#228f47' : '#fff',
                        // color: 'green',
                        borderColor: 'green',

                      }}
                      size="small"
                      onClick={() => { handleSubcategorySelect(subcategory.name); setShow(true) }}
                    >
                      {subcategory.name}
                    </Button>
                    <IconButton
                      color="success"
                      size="small"
                      onClick={() => {
                        setSelectedCategory(subcategory.name);
                        setCategoryId(subcategory._id); // Set the category ID
                        openDialog1();// Open the dialog when the Edit button is clicked
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                ))}
              </Grid>}
              {show ? <Grid item xs={12} sm={6} md={4}>
                <TextField
                  placeholder="Add Subcategory"
                  variant="outlined"
                  size="small"
                  color='success'
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  InputProps={{
                    style: {
                      color: 'success',
                      borderRadius: '5px 0px 0px 5px',
                      backgroundColor: '#fff',
                    },
                  }}
                  sx={{
                    width: '265px', // Set the desired width here
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'green', // Set the border color when the field is not focused
                      },
                      '&:hover fieldset': {
                        borderColor: 'lightgreen', // Set the border color when the field is focused
                      },
                    },
                  }}
                />
                <button type='submit' className='save-btn' onClick={handleSubmit3}>Save</button>
                {/* <IconButton onClick={handleSubmit3} color='success'>
                  <PublishRoundedIcon />
                </IconButton> */}
                <br /><br /><br />


                {subcategories2.map((subcategory, index) => (
                  <div key={index}>
                    <Button
                      variant={selectedSubcategory === subcategory.name ? 'contained' : 'outlined'}
                      style={{
                        marginBottom: '10px',
                        width: '240px',
                        backgroundColor: selectedSubcategory === subcategory.name ? '#228f47' : '#fff',
                        // color: 'green',
                        borderColor: 'green',
                      }}
                      size="small"
                    >
                      {subcategory.name}
                    </Button>
                    <IconButton
                      color="success"
                      size="small"
                      onClick={() => {
                        setSelectedCategory(subcategory.name);
                        setCategoryId(subcategory._id); // Set the category ID
                        openDialog2();// Open the dialog when the Edit button is clicked

                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                ))}
                {errorMessage && (
                  <div style={{ color: 'red', paddingTop: '10px' }}>{errorMessage}</div>
                )}
                {successMessage && (
                  <div style={{ color: 'green', paddingTop: '10px' }}>{successMessage}</div>
                )}
              </Grid> : <Grid item xs={12} sm={8} md={6}></Grid>}
            </div>
            {/* Create a Dialog for editing and deleting Main Category */}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogContent>
                {/* Add fields for editing category */}
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />

                <FormControl fullWidth style={{ marginTop: '20px' }}>
                 
                  <Input type="file" onChange={handleImageChange} />
                </FormControl>

                {selectedImage &&
                      <div className='image-preview'>
                        <img src={URL.createObjectURL(selectedImage)} alt="preview" className='icon-img' style={{padding:'15px'}} />
                        <FontAwesomeIcon icon={faTrash} onClick={() => setSelectedImage(null)} className="delete-icon" />
                      </div>
                    }
                
                {/* Display the selected image filename */}
                
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCategoryDelete} color="secondary">
                  Delete
                </Button>
                <Button onClick={handleCategoryUpdate} color="primary" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : 'Update'}
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={isDialogOpen1} onClose={closeDialog1}>
              <DialogTitle>Edit Main Category</DialogTitle>
              <DialogContent>
                {/* Add fields for editing category */}
                <TextField

                  variant="outlined"
                  size="small"
                  fullWidth
                  // Bind the input field to a state variable for editing
                  value={selectedCategory || selectedSubcategory}
                  // Add an onChange handler to update the state variable when editing
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog1} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCategoryUpdate1} color="primary">
                  Update
                </Button>
                <Button onClick={handleCategoryDelete2} color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={isDialogOpen2} onClose={closeDialog2}>
              <DialogTitle>Edit SubCategory</DialogTitle>
              <DialogContent >
                {/* Add fields for editing category */}
                <TextField

                  variant="outlined"
                  size="small"
                  fullWidth
                  // Bind the input field to a state variable for editing
                  value={selectedCategory || selectedSubcategory}
                  // Add an onChange handler to update the state variable when editing
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog2} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCategoryUpdate2} color="primary">
                  Update
                </Button>
                <Button onClick={handleCategoryDelete3} color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default AddCategory;
