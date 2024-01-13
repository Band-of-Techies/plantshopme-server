// import React, { useEffect, useState } from 'react';
// import { Button, Dialog, DialogTitle, Container, DialogContent, FormControlLabel, Checkbox, FormGroup, DialogActions, Grid, TextField, MenuItem, Typography } from '@mui/material';

// import axios from 'axios';

// import IconButton from '@mui/material/IconButton';
// import AddIcon from '@mui/icons-material/Add';

// const Dimensions = () => {
   
  

//     const [selectedPots1, setSelectedPots1] = useState('');



//     const [PotNames, setPotNames] = useState([]);
//     const fetchPots = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/listAllPots');
//             setPotNames(response.data);
//         } catch (error) {
//             console.error('Error fetching Pot names:', error);
//         }
//     };

//     useEffect(() => {
//         fetchPots();
       

//     }, []);

//     const Dim = [
//         {
//             value: 'Single Field',
//             label: 'Single Field',
//         },
//         {
//             value: 'Multi Field',
//             label: 'Multi Field',
//         },

//     ];

//     const [selectedCategoryDim, setSelectedCategoryDim] = useState('');
//     const [selectedimension, setSelectedDimension] = useState('');
//     const [dimensionOptions, setDimensionOptions] = useState([]);
//     const [isDialogOpen, setDialogOpen] = useState(false);
//     const [inputValue, setInputValue] = useState('');
//     const [inputValuedi, setInputValuedi] = useState('');
//     const [inputValued2, setInputValued2] = useState('');
//     const [inputValuePrice, setInputValuePrice] = useState('');
    

//     const [colorslist, setcolorsList] = useState('');

//     const [fieldlist, setFieldlist] = useState('');

//     const [newColor, setNewColor] = useState('');
//     const [selectedcolors, setselectedcolors] = useState('')
//     //Colors #####################################################################
//     const [field, setField] = useState('');

//     const handleFieldChange = (e) => {
//         setField(e.target.value);
//     };
//     const [setFieldStatus, SetSelectedFieldStatus] = useState('');

//     const handleInsertField = async () => {
//         try {
//             // Assuming your server is running on http://localhost:5000/api
//             await axios.post('http://localhost:5000/api/insertField', { field });
//             // Optionally, you can reset the form fields after successful insertion
//             setField('');
//             console.log('Field inserted successfully!');
//         } catch (error) {
//             console.error('Error inserting field:', error);
//         }
//         fetchFields();
//     };

//     const fetchFields = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/getAllFields');
//             console.log(response.data); // Log the response to inspect the structure

//             const fieldsArray = response.data; // Adjust this based on the actual structure

//             setFieldlist(fieldsArray);
//         } catch (error) {
//             console.error('Error fetching Fields:', error);
//         }
//     };


//     useEffect(() => {

//         fetchFields();
//     }, []);
//     const [isDialogOpen2, setDialogOpen2] = useState(false);
//     const [isDialogOpen3, setDialogOpen3] = useState(false);

//     const fetchColors = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/getAllColors');
//             const colors = response.data;
//             setcolorsList(colors);
//         } catch (error) {
//             console.error('Error fetching Colors:', error);
//         }
//     };

//     useEffect(() => {
//         fetchColors();

//     }, []);


//     const addColor = async () => {
//         try {
//             // Assuming you have an API endpoint to add a new color
//             await axios.post('http://localhost:5000/api/insertColor', { color: newColor });
//             // After adding the color, refetch the colors
//             fetchColors();
//             // Optionally, you can clear the input field
//             setNewColor('');
//         } catch (error) {
//             console.error('Error adding color:', error);
//         }
//         fetchColors();
//     };

//     const fetchDimensions = async (category) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/getDimensionTags/${category}`);
//             const dimensionTags = response.data;
//             setDimensionOptions(dimensionTags);
//         } catch (error) {
//             console.error('Error fetching Dimensions:', error);
//         }
//     };

//     useEffect(() => {
//         if (selectedCategoryDim) {
//             fetchDimensions(selectedCategoryDim);
//         }
//     }, [selectedCategoryDim]);

//     const handleDialogOpen = () => {
//         setDialogOpen(true);
//     };

//     const handleDialogOpen2 = () => {
//         setDialogOpen2(true);
//     };

//     const handleDialogOpen3 = () => {
//         setDialogOpen3(true);
//     };
//     const handleDialogClose3 = () => {
//         setDialogOpen3(false);
//     };

//     const handleDialogClose2 = () => {
//         setDialogOpen2(false);
//     };

//     const handleDialogClose = () => {
//         setDialogOpen(false);
//     };

//     const handleAddButtonClick = () => {
//         handleDialogOpen();
//     };

//     const handleAddOption = async () => {
//         try {
//             // Perform the logic to add the new option with dimension and status
//             await axios.post('http://localhost:5000/api/addDimensionTag', {
//                 name: inputValue,  // Using inputValue as the dimension value
//                 Status: selectedCategoryDim,  // Using selectedCategoryDim as the status value
//             });

//             // Close the dialog
//             handleDialogClose();

//             // Optionally, you can fetch the updated dimensions after adding a new one
//             if (selectedCategoryDim) {
//                 fetchDimensions(selectedCategoryDim);
//             }
//         } catch (error) {
//             console.error('Error adding option:', error);
//         }
//     };
 

   

//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [selectedsubCategory, setSelectedsubCategory] = useState(null);
//     const [selectedsubCategory2, setSelectedsubCategory2] = useState(null);

//         const handleSubmitDim = async () => {
//         try {
//             // Iterate through each set of data and insert into the database
//             // for (const item of dataList) {
//             let value2 = inputValued2 || selectedcolors || selectedPots1 || '';

//             await axios.post('http://localhost:5000/api/selectedDimensionsDetails', {
//                 Value1: inputValuedi,
//                 Field2: selectedimension,
//                 Field1: selectedCategoryDim,
//                 Price: inputValuePrice,

//                 Value2: value2,
//                 productName: productTitle,
//                 maincategory: selectedCategory,
//                 category: selectedsubCategory,
//                 subcategory: selectedsubCategory2,
//             });

            
//             setInputValuePrice('');
//             setInputValued2('');
//             setselectedcolors('');
//             setSelectedPots1('');
//         } catch (error) {
//             console.error('Error submitting details:', error);
//         }
//     };



//     return (
//         <><h4>Select Dimensions</h4><div style={{ padding: '20px' }}>
//             <div style={{ alignItems: 'center', marginBottom: '20px', paddingTop: '10px' }}>
//                 <div style={{ marginRight: '20px', paddingBottom: "20px" }}>
//                     <div style={{ display: 'flex', alignItems: 'center' }}>

//                         <TextField
//                             id="outlined-select-category"
//                             select
//                             label="Select Parameters"
//                             style={{ minWidth: '245px', paddingRight: '10px' }}
//                             color="success"
//                             onChange={(e) => {
//                                 SetSelectedFieldStatus(e.target.value);
//                                 // Call your function when the selection changes
//                             }}
//                         >
//                             {Array.isArray(fieldlist) &&
//                                 Dim.map((option) => (
//                                     <MenuItem key={option.value} value={option.value}>
//                                         {option.value}
//                                     </MenuItem>
//                                 ))}
//                         </TextField>


//                         <TextField
//                             id="outlined-select-category"
//                             label="Select Field 1"
//                             select

//                             style={{ minWidth: '240px' }}
//                             color="success"
//                             onChange={(e) => setSelectedCategoryDim(e.target.value)}

//                         >
//                             {Array.isArray(fieldlist) &&
//                                 fieldlist.map((option) => (
//                                     <MenuItem key={option._id} value={option.Field}>
//                                         {option.Field}
//                                     </MenuItem>
//                                 ))}
//                         </TextField>

//                         <IconButton onClick={handleDialogOpen3} color="primary" style={{ marginLeft: '20px' }}>
//                             <AddIcon />
//                         </IconButton>
//                         {Array.isArray(dimensionOptions) && dimensionOptions.length >= 0 && setFieldStatus === "Multi Field" && setFieldStatus !== "Single Field" && (
//                             <><div style={{ marginLeft: '20px' }}>
//                                 <TextField
//                                     id="outlined-select-dimensions"
//                                     select
//                                     label="Select Field 2"
//                                     style={{ minWidth: '240px', paddingRight: '8px' }}
//                                     color="success"
//                                     onChange={(e) => setSelectedDimension(e.target.value)}
//                                 >
//                                     {dimensionOptions.map((dimension) => (
//                                         <MenuItem key={dimension._id} value={dimension.Dimension}>
//                                             {dimension.Dimension}
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </div><IconButton onClick={handleDialogOpen} color="primary" style={{ marginLeft: '20px' }}>
//                                     <AddIcon />
//                                 </IconButton></>
//                         )}


//                     </div>


//                 </div>
//                 <div style={{ paddingLeft: '237px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                         <TextField
//                             label="Value1"
//                             value={inputValuedi}
//                             onChange={(e) => setInputValuedi(e.target.value)}
//                             style={{ marginLeft: '20px', paddingRight: '60px' }} />

//                         {setFieldStatus.length > 0 && selectedimension.length > 0 && selectedimension !== "Color" && selectedimension !== "POT" && (
//                             (() => {
//                                 if (setFieldStatus === "Multi Field" && setFieldStatus !== "Single Field") {
//                                     return (
//                                         <TextField
//                                             label="Value2"
//                                             value={inputValued2}
//                                             onChange={(e) => setInputValued2(e.target.value)}
//                                             style={{ marginLeft: '40px', paddingRight: '20px' }} />
//                                     );
//                                 }
//                                 else {
//                                     return null; // Hide the TextField when conditions are not met
//                                 }
//                             })()
//                         )}


//                         {selectedimension.length > 0 && (
//                             (() => {
//                                 if (selectedimension === "Color" && setFieldStatus === "Multi Field" && setFieldStatus !== "Single Field") {
//                                     return (
//                                         <>
//                                             <div style={{ marginLeft: '20px' }}>
//                                                 <TextField
//                                                     id="outlined-select-dimensions"
//                                                     select
//                                                     style={{ minWidth: '200px', marginLeft: '20px', paddingRight: '20px' }}
//                                                     color="success"
//                                                     onChange={(e) => setselectedcolors(e.target.value)}
//                                                 >
//                                                     {Array.isArray(colorslist) &&
//                                                         colorslist.map((dimension) => (
//                                                             <MenuItem key={dimension._id} value={dimension.Color}>
//                                                                 {dimension.Color}
//                                                             </MenuItem>
//                                                         ))}
//                                                 </TextField>
//                                             </div>
//                                             <div>
//                                                 <IconButton onClick={handleDialogOpen2} color="primary" style={{ marginLeft: '20px' }}>
//                                                     <AddIcon />
//                                                 </IconButton>
//                                             </div>
//                                         </>
//                                     );
//                                 }
//                                 return null;
//                             })()
//                         )}

//                         {selectedimension.length > 0 && (
//                             (() => {
//                                 if (selectedimension === "POT" && setFieldStatus === "Multi Field" && setFieldStatus !== "Single Field") {
//                                     return (
//                                         <>
//                                             <div style={{ marginLeft: '20px' }}>
//                                                 <TextField
//                                                     id="outlined-select-dimensions"
//                                                     select
//                                                     style={{ minWidth: '200px', marginLeft: '20px', paddingRight: '20px' }}
//                                                     color="success"
//                                                     onChange={(e) => setSelectedPots1(e.target.value)}
//                                                 >
//                                                     {Array.isArray(PotNames) &&
//                                                         PotNames.map((dimension) => (
//                                                             <MenuItem key={dimension._id} value={dimension.name}>
//                                                                 {dimension.name}
//                                                             </MenuItem>
//                                                         ))}
//                                                 </TextField>
//                                             </div>
//                                             <div>

//                                             </div>
//                                         </>
//                                     );
//                                 }
//                                 return null;
//                             })()
//                         )}


//                         <TextField
//                             label="Price"
//                             value={inputValuePrice}
//                             onChange={(e) => setInputValuePrice(e.target.value)}
//                             style={{ marginLeft: '20px', paddingLight: '30px' }} />

//                         <Button onClick={handleSubmitDim} color="primary" style={{ marginLeft: '20px' }}>
//                             Add to List
//                         </Button>
//                     </div>

//                 </div>

//             </div>


//             {/* Dialog for adding new Fields */}
//             <Dialog open={isDialogOpen3} onClose={handleDialogClose3}>
//                 <DialogTitle>Add New Fields</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Field"
//                         value={field}
//                         onChange={handleFieldChange} />


//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose3}>Cancel</Button>
//                     {/* Use the 'Submit' button to submit the details */}
//                     <Button onClick={handleInsertField} color="primary">
//                         Add
//                     </Button>
//                 </DialogActions>
//             </Dialog>


//             {/* Dialog for adding new option */}
//             <Dialog open={isDialogOpen2} onClose={handleDialogClose2}>
//                 <DialogTitle>Add New Color</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Color"
//                         value={newColor}
//                         onChange={(e) => setNewColor(e.target.value)} />


//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose2}>Cancel</Button>
//                     {/* Use the 'Submit' button to submit the details */}
//                     <Button onClick={addColor} color="primary">
//                         Add
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Dialog for adding new option */}
//             <Dialog open={isDialogOpen} onClose={handleDialogClose}>
//                 <DialogTitle>Add New Option</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Value"
//                         value={inputValue}
//                         onChange={(e) => setInputValue(e.target.value)} />
//                     <div style={{ paddingTop: '20px' }}> <TextField
//                         label="Category"
//                         select
//                         value={selectedCategoryDim}
//                         onChange={(e) => setSelectedCategoryDim(e.target.value)}

//                     >
//                         {Array.isArray(fieldlist) &&
//                             fieldlist.map((option) => (
//                                 <MenuItem key={option._id} value={option.Field}>
//                                     {option.Field}
//                                 </MenuItem>
//                             ))}
//                     </TextField></div>

//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose}>Cancel</Button>
//                     {/* Use the 'Submit' button to submit the details */}
//                     <Button onClick={handleAddOption} color="primary">
//                         Add
//                     </Button>
//                 </DialogActions>
//             </Dialog>



//         </div></>


//     );
// };

// export default Dimensions;