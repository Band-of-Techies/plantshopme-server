import React, { useEffect, useState } from 'react';
import { Button, Grid, TextField, IconButton, TextareaAutosize } from '@mui/material';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, CircularProgress,Select } from '@mui/material';
import ProductImageUpdation from './ProductImageUpdation';
import { useParams, useNavigate } from 'react-router-dom';
import Dimensions from '../../Allproducts/OtherProducts/Dimensions';
import { Wrapper } from './addProductWrapper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Updatedimensions from '../../Allproducts/OtherProducts/Updatedimensions';
import UpdateCategories from '../../UpdateProductCategories/UpdateCategories';
const ProductUpdateForm = () => {
  const [updatedTitle, setUpdatedTitle] = useState('');
  const[updateMname,setupdateMname]=useState('');
  const[updateMdiscription,setupdateMdiscription]=useState('');
    const [updatedScienticname, setupdatedScienticname] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updateimpdescription,setupdateimpdescription]=useState('');
  const [productId, setSelectedProductId] = useState('');
  const [updatePhotos, setUpdatedPhotos] = useState([]);
  const [pots, setPots] = useState([]);
  const [featureTags, setFeatureTags] = useState([]);
  const [careNameValues, setCareNameValues] = useState([]);
  const [lengthList, setLengthList] = useState([]);
  const [isContentVisible, setContentVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setContentVisible(false);
    handleRefresh();
    fetchFeatureNames();
  }, []);

  const { _Id, title } = useParams();

  //Add PlantCare
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [plantcareData, setPlantcareData] = useState({
    name: '',
    description: '',
  });

  const [LengthDatas, setLengthDatas] = useState({
    price: '',
    length: '',
  });

  const handlelengthDataChange = (e) => {
    const { name, value } = e.target;
    setLengthDatas((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlantcareData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const uploadProductcarelist = async () => {
    try {
      const productIdFromLocalStorage = localStorage.getItem('selectedProductName');
      const localmaincategory = localStorage.getItem('selectedmaincategory');
      const localcategory = localStorage.getItem('selectedcategory');
      const localsubcategory = localStorage.getItem('selectedsubcategory');

      // Gather the data from your form or wherever it's coming from
      const formData = {
        title: title,
        careName: plantcareData.name,
        caredes: plantcareData.description,
        maincategory: localmaincategory,
        category: localcategory,
        subcategory: localsubcategory,
        // // photo: plantcareData.image
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

        const data = await response.json();
        // setMessage('Product care data inserted successfully');
      } else if (response.status === 400) {
        // If status is 400, it means there are duplicates
        const data = await response.json();
        // setMessage(data.error);
      } else {
        // Handle other errors
        // setMessage('Error inserting product data');
      }
    } catch (error) {
      // Handle any network or unexpected errors
      // setMessage('Error inserting product data: ' + error.message);
    }

  };

  const uploadLengthlist = async () => {
    try {
      const productIdFromLocalStorage = localStorage.getItem('selectedProductName');
      const localmaincategory = localStorage.getItem('selectedmaincategory');
      const localcategory = localStorage.getItem('selectedcategory');
      const localsubcategory = localStorage.getItem('selectedsubcategory');

      // Gather the data from your form or wherever it's coming from
      const formData = {
        productName: title,
        length: LengthDatas.length,
        price: LengthDatas.price,
        mainCategory: localmaincategory,
        category: localcategory,
        subCategory: localsubcategory,
        // // photo: plantcareData.image
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
        // setMessage('Product care data inserted successfully');
      } else if (response.status === 400) {
        // If status is 400, it means there are duplicates
        const data = await response.json();
        // setMessage(data.error);
      } else {

      }
    } catch (error) {

    }
    handleLengthList();
    handleCloseDialog2();

  };

  // Add Length  
  const [openDialog2, setOpenDialog2] = useState(false);
  const handleOpenDialog2 = () => {
    setOpenDialog2(true);
  };


  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };


  const handleTitleChange = (e) => {
    setUpdatedTitle(e.target.value);
  };
  const handleMnamechange=(e)=>{
    setupdateMname(e.target.value);
  }
const handleMdiscriptionChange=(e)=>{
  setupdateMdiscription(e.target.value);
}
  const handleScientificcahnge=(e)=>{
    setupdatedScienticname(e.target.value);
  }

  const handleDescriptionChange = (e) => {
    setUpdatedDescription(e.target.value);
  };
const handleimpdescriptionchange =(e)=>{
  setupdateimpdescription(e.target.value);
}
  const handleRemovePhoto = (indexToRemove) => {
    const updatedPhotosCopy = updatePhotos.filter((_, index) => index !== indexToRemove);
    setUpdatedPhotos(updatedPhotosCopy);
  };

  const handleUpdatePlantCare = async (_id, newCareName, newCaredes) => {
    try {
      if (_id && newCareName && newCaredes) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/updatePlantCareList/${_id}`, {
          careName: newCareName,
          caredes: newCaredes,
        });
        handlePlantCare();
      } else {
        toast.error('Invalid parameters for updating plant care');
      }
    } catch (error) {
      toast.error('Error updating plant care:', error);
    }
  };


  const handleUpdateLength = async (_id, newPrice, newLength) => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/updateLengthAndPrice/${_id}`, {
        price: newPrice,
        length: newLength,
      });

      handleLengthList();
    } catch (error) {
      toast.error('Error updating length and price:', error);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteProduct/${_Id}`);



      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    const productIdFromLocalStorage = localStorage.getItem('selectedProductId');

    let pId = ''
    if (productIdFromLocalStorage != '') {
      pId = productIdFromLocalStorage
    }
    setSelectedProductId(productIdFromLocalStorage);
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getSingleProduct/${_Id}`);
      setTimeout(() => {
        setUpdatedTitle(response.data.product.title);
        setupdatedScienticname(response.data.product.scienticName);
       setupdateMname(response.data.product.Mname);
       setupdateMdiscription(response.data.product.Mdiscription);
        setUpdatedDescription(response.data.product.description);
        setupdateimpdescription(response.data.product.impdescription)
        setUpdatedPhotos(response.data.product.photos);
        setPots(response.data.product.Pots || []);
        setFeatureTags(response.data.product.FeatureTag || []);
        handlePlantCare(); // Typo: Corrected the function name
        handleLengthList();



        setContentVisible(true);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handlePlantCare = async () => {
    const productIdFromLocalStorage = localStorage.getItem('selectedProductName');
    setSelectedProductId(productIdFromLocalStorage);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getPlantCareList/${title}`);
      const careNameArray = response.data || [];
      setCareNameValues(careNameArray);
    } catch (error) {
      // toast.error('Error fetching Plantcare details:', error);
    }
  };

  const handleLengthList = async () => {
    const productIdFromLocalStorage = localStorage.getItem('selectedProductName');
    setSelectedProductId(productIdFromLocalStorage);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getLengthAndPrice/${title}`);
      const lengthArray = response.data || [];
      // toast.success('Length Array:', lengthArray); // Log the received data
      setLengthList(lengthArray); // Ensure lengthList is an array
    } catch (error) {
      // toast.error('Error fetching length and price details:', error);
      setLengthList([]); // Set default empty array in case of an error
    }
  };



  const handleUpdateTitle = async () => {
    const productIdFromLocalStorage = localStorage.getItem('selectedProductId');
    setSelectedProductId(productIdFromLocalStorage);

    try {
      const careNames = careNameValues.map((item) => ({
        _id: item._id,
        careName: item.careName,
        caredes: item.caredes,
      }));

      const lengthNames = lengthList.map((item) => ({
        _id: item._id,
        price: item.price,
        length: item.length,
      }));

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/updateProduct/${_Id}`, {
        title: updatedTitle,
        scienticName:updatedScienticname,
        Mname:updateMname,
        Mdiscription:updateMdiscription,
        description: updatedDescription,
        impdescription:updateimpdescription,
        photos: updatePhotos,
        Pots: pots,
        FeatureTag: featureTags,
      });

      toast.success('Product Details updated:', response.data);

      for (const care of careNames) {
        await handleUpdatePlantCare(care._id, care.careName, care.caredes);
      }

      for (const len of lengthNames) {
        await handleUpdateLength(len._id, len.price, len.length);
      }
    } catch (error) {
      toast.error('Error for updating:', error);
    }
  };

  const handleEditPhoto = (index, newPhoto) => {
    const updatedPhotosCopy = [...updatePhotos];
    updatedPhotosCopy[index] = newPhoto;
    setUpdatedPhotos(updatedPhotosCopy);
  };

  const onDrop = (acceptedFiles) => {
    toast.success('Accepted Files:', acceptedFiles);

    const newPhoto = acceptedFiles[0];
    if (newPhoto) {
      const updatedPhotosCopy = [...updatePhotos, newPhoto];
      toast.success('Updated Photos:', updatedPhotosCopy);
      setUpdatedPhotos(updatedPhotosCopy);
    }
  };


  const handleCareNameChange = (index, value) => {
    const newValues = [...careNameValues];
    newValues[index].careName = value;
    setCareNameValues(newValues);
  };

  const handleLengthChange = (index, value) => {
    const newValues = [...lengthList];
    newValues[index].length = value;
    setLengthList(newValues);
  };

  const handlePriceChange = (index, value) => {
    const newValues = [...lengthList];
    newValues[index].price = value;
    setLengthList(newValues);
  };

  const handleCaredesChange = (index, value) => {
    const newValues = [...careNameValues];
    newValues[index].caredes = value;
    setCareNameValues(newValues);
  };

  const handlePotChange = (index, value) => {
    const newPots = [...pots];
    newPots[index] = value;
    setPots(newPots);
  };

  const handleAddPot = () => {
    setPots([...pots, '']);
  };

  const handleRemovePot = (index) => {
    const newPots = [...pots];
    newPots.splice(index, 1);
    setPots(newPots);
  };

  const handleFeatureTagChange = (index, value) => {
    const newValues = [...featureTags];
    newValues[index] = value;
    setFeatureTags(newValues);
  };

  const handleAddFeatureTag = () => {
    setFeatureTags([...featureTags, '']);
  };

  const handleRemoveFeatureTag = (index) => {
    const newFeatureTags = [...featureTags];
    newFeatureTags.splice(index, 1);
    setFeatureTags(newFeatureTags);
  };


  const handleRemoveLengthAndPrice = async (index) => {
    try {
      const removedItem = lengthList[index];

      // Log for debugging purposes
      toast.success('Removing length and price entry with ID:', removedItem._id);

      // Make an API call to remove the length and price entry from the server
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteLengthAndPrice/${removedItem._id}`);

      // Check the response status before updating the local state
      if (response.status === 200) {
        // Update the local state by removing the corresponding item
        const newLengthList = [...lengthList];
        newLengthList.splice(index, 1);
        setLengthList(newLengthList);

        toast.success('Length and price entry removed successfully');
      } else {
        toast.error('Failed to remove length and price entry. Server responded with:', response.status, response.data);
      }
    } catch (error) {
      toast.error('Error removing length and price entry:', error);

      // Log the response for debugging purposes
      if (error.response) {
        toast.error('Response data:', error.response.data);
        toast.error('Response status:', error.response.status);
      }
    }
  };


  const handleRemoveplantcare = async (index) => {
    try {
      const removedItem = careNameValues[index];

      // Log for debugging purposes
      toast.success('Removing plant care with ID:', removedItem._id);

      // Make an API call to remove the care item from the server
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/deletePlantCare/${removedItem._id}`);

      // Check the response status before updating the local state
      if (response.status === 200) {
        // Update the local state by removing the corresponding item
        const newCareNameValues = [...careNameValues];
        newCareNameValues.splice(index, 1);
        setCareNameValues(newCareNameValues);

        toast.success('Plant care removed successfully');
      } else {
        toast.error('Failed to remove plant care. Server responded with:', response.status, response.data);
      }
    } catch (error) {
      toast.error('Error removing plant care:', error);

      // Log the response for debugging purposes
      if (error.response) {
        toast.error('Response data:', error.response.data);
        toast.error('Response status:', error.response.status);
      }
    }
  };
  const [selectedFeature, setSelectedFeature] = useState('');
  const [featureNames, setFeatureNames] = useState([]);
  const fetchFeatureNames = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/getFeatures`)
        .then((response) => {
            // Filter out duplicates and null values
            const uniqueFeatureNames = response.data
                .filter((name, index, self) => self.indexOf(name) === index && name !== null);

           // Set the initial value to the first feature name
        if (uniqueFeatureNames.length > 0) {
          setSelectedFeature(uniqueFeatureNames[0]);
        }

            // Convert the Set to an array for rendering
            setFeatureNames([...uniqueFeatureNames]);
        })
        .catch((error) => {
            // toast.error('Error fetching feature names:', error);
        });
};


  return (
    <Wrapper>
      <ToastContainer/>
      <div style={{ padding: '10px' }}>

        {isLoading && <CircularProgress style={{ marginLeft: '10px' }} />}
        <div style={{ paddingTop: '10px', paddingLeft: '30px' }}>
          <Grid container spacing={2} style={{ paddingTop: '10px', paddingLeft: '10px', overflowY: 'auto' }}>
            <Grid item xs={12} sm={6} md={6}>
              <div style={{ paddingTop: '10px', paddingLeft: '30px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Title"
                    variant="outlined"
                    value={updatedTitle}
                    onChange={handleTitleChange}
                    style={{ width: '70%', marginRight: '8px' }}
                  />
                  {/* Include your delete button here if needed */}
                </div>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Scientific Name"
                    variant="outlined"
                    value={updatedScienticname}
                    onChange={handleScientificcahnge}
                    style={{ width: '70%', marginRight: '8px' }}
                  />
                  {/* Include your delete button here if needed */}
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Meta Name"
                    variant="outlined"
                    value={updateMname}
                    onChange={handleMnamechange}
                    style={{ width: '70%', marginRight: '8px' }}
                  />
                  {/* Include your delete button here if needed */}
                </div>
                
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Meta Description"
                    variant="outlined"
                    value={updateMdiscription}
                    onChange={handleMdiscriptionChange}
                    style={{ width: '70%', marginRight: '8px' }}
                  />
                  {/* Include your delete button here if needed */}
                </div>

                <div style={{ paddingTop: '30px' }}>
                  {isContentVisible && <ProductImageUpdation key={Date.now()} />}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <TextField
                    label='Description'
                    minRows={3}
                    value={updatedDescription}
                    onChange={handleDescriptionChange}
                    style={{
                      width: '90%',

                      backgroundColor: 'white',
                    }}
                    multiline
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <TextField
                    label='Important Description'
                    minRows={3}
                    value={updateimpdescription}
                    onChange={handleimpdescriptionchange}
                    style={{
                      width: '90%',

                      backgroundColor: 'red',
                    }}
                    multiline
                  />
                </div>

                {/* <div style={{ paddingTop: '10px' }}>
                  <h3>Pots</h3>
                  {pots.map((pot, index) => (
                    <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label={`Pot ${index + 1}`}
                        value={pot}
                        onChange={(e) => handlePotChange(index, e.target.value)}
                        style={{ width: '70%', marginRight: '10px', marginTop: '10px' }}
                      />
                      <IconButton color="secondary" onClick={() => handleRemovePot(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                  <div style={{ paddingTop: '10px' }}>
                    <IconButton color="success" onClick={handleAddPot}>
                      <AddIcon />
                    </IconButton>
                  </div>
                </div> */}

                <div style={{ paddingTop: '10px', marginTop: '10px' }}>
                  <h3 style={{ marginTop: '5px' }}>Feature Tags</h3>
                  {featureTags.map((tag, index) => (
        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <Select
            label={`Tag ${index + 1}`}
            value={tag}
            onChange={(e) => {
              const selectedValue = e.target.value;
              const selectedObject = featureNames.find(feature => feature.name === selectedValue);
              setSelectedFeature(selectedObject);
              handleFeatureTagChange(index, selectedValue);
            }}
            style={{ width: '70%', marginRight: '10px' }}
          >
            {featureNames.map((feature, nameIndex) => (
              <MenuItem key={nameIndex} value={feature.name}>
                {feature.name}
              </MenuItem>
            ))}
          </Select>
          <IconButton color="secondary" onClick={() => handleRemoveFeatureTag(index)}>
            {/* Your icon component (DeleteIcon) */}<DeleteIcon/>
          </IconButton>
        </div>
      ))}
                  <Button variant="contained" color="success" onClick={handleAddFeatureTag}>
                    Add Feature Tag
                  </Button>
                </div>

                <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" color="success" onClick={() => handleUpdateTitle()}>
                    Update Product
                  </Button>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <div style={{ paddingTop: '50px', margin: "5px" }}>
                <h3 style={{ marginTop: '20px', width: "200px" }}>Care List</h3>
                {careNameValues.map((item, index) => (
                  <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>


                    <TextField
                      label="Care Name"
                      value={item.careName}
                      onChange={(e) => handleCareNameChange(index, e.target.value)}
                      style={{ marginBottom: '8px', width: '100%' }}
                    />
                    <Grid>
                      <TextField
                        label="Description"
                        value={item.caredes}
                        onChange={(e) => handleCaredesChange(index, e.target.value)}
                        multiline
                        rows={4} // Adjust the number of rows as needed to increase the height
                        style={{ marginBottom: '8px', width: '100%' }}
                      /></Grid>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdatePlantCare(item._id, item.careName, item.caredes)} style={{ marginRight: '8px' }}
                    >
                      Update Care
                    </Button>
                    <IconButton color="secondary" onClick={() => handleRemoveplantcare(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
                <IconButton onClick={handleOpenDialog} style={{ borderRadius: '50%' }}>
                  <AddIcon style={{ color: 'black' }} />
                </IconButton>
              </div>

              <div style={{ paddingTop: '20px' }}>
               

               <UpdateCategories/>

                {/* {lengthList.map((item, index) => (
                  <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={6}>
                        <TextField
                          label="Length"
                          value={item.length}
                          onChange={(e) => handleLengthChange(index, e.target.value)}
                          fullWidth
                        /></Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Price"
                          value={item.price}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          fullWidth
                        />  </Grid>
                    </Grid>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateLength(item._id, item.price, item.length)}
                      style={{ marginRight: '8px' }}
                    >
                      Update
                    </Button>
                    <IconButton color="secondary" onClick={() => handleRemoveLengthAndPrice(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}<IconButton onClick={handleOpenDialog2} style={{ borderRadius: '50%' }}>
                  <AddIcon style={{ color: 'black' }} />
                </IconButton> */}
             
              </div>
              

            </Grid>
           
            
          </Grid>
<div style={{padding:'20px'}}>
<h3 style={{ marginTop: '20px', width: "200px" }}>Product Dimensions</h3>
            <Updatedimensions/>
</div>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Add New Care</DialogTitle>
            <DialogContent>
              <div style={{ paddingTop: '10px' }}>
                <TextField
                  label="New Care Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={plantcareData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ paddingTop: '10px' }}>
                <TextField
                  label="Description"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={5}
                  style={{ marginBottom: '8px', width: '100%' }}
                  name="description"
                  value={plantcareData.description}
                  onChange={handleInputChange}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={uploadProductcarelist} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDialog2} onClose={handleCloseDialog2}>
            <DialogTitle>Add New Length</DialogTitle>
            <DialogContent>
              <div style={{ paddingTop: '10px' }}>
                <TextField
                  label="New Length"
                  variant="outlined"
                  fullWidth
                  name='length'
                  value={LengthDatas.length}
                  onChange={handlelengthDataChange}

                />
              </div>
              <div style={{ paddingTop: '10px' }}>
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  name='price'
                  value={LengthDatas.price}
                  onChange={handlelengthDataChange}
                />
              </div>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog2}>Cancel</Button>
              <Button color="primary" onClick={uploadLengthlist}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div >

    </Wrapper>

  );
};

export default ProductUpdateForm;