import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Button, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductImageUpdation = () => {
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);

    const fetchExistingPhotos = () => {
        const productIdFromLocalStorage = localStorage.getItem('pId');
        if (productIdFromLocalStorage) {
            fetch(`${process.env.REACT_APP_BASE_URL}/getProductPhotos/${productIdFromLocalStorage}`)
                .then((response) => response.json())
                .then((data) => setExistingPhotos(data.photos))
                .catch((error) => console.error('Error fetching existing photos:', error));
        } else {
            // Clear existingPhotos if productIdFromLocalStorage is not available
            setExistingPhotos([]);
        }
    };

    useEffect(() => {
        fetchExistingPhotos();
    }, []); // Empty dependency array to run the effect only once on mount

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        // Update previewPhotos to display selected new photos instantly
        setPreviewPhotos((prevPhotos) => [
            ...prevPhotos,
            ...selectedFiles.map((file) => URL.createObjectURL(file)),
        ]);

        // Update newPhotos with selected files
        setNewPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);


        setFileInputKey((prevKey) => prevKey + 1);
    };

    const handleDelete = (index, photoId) => {
        // Create a promise to handle the asynchronous nature of state updates
        const deletionPromise = new Promise((resolve) => {
            setPreviewPhotos((prevPhotos) => {
                const updatedPreviewPhotos = [...prevPhotos];
                updatedPreviewPhotos.splice(index, 1);
                return updatedPreviewPhotos;
            });

            setNewPhotos((prevPhotos) => {
                const updatedNewPhotos = [...prevPhotos];
                updatedNewPhotos.splice(index, 1);
                return updatedNewPhotos;
            });

            // Resolve the promise after the state updates are completed
            resolve();
            fetchExistingPhotos();
        });

        // Wait for the promise to be resolved before continuing
        deletionPromise.then(() => {
            // Make a DELETE request to remove the photo from the database
            const productIdFromLocalStorage = localStorage.getItem('pId');
            let pid = ''
            if (productIdFromLocalStorage != '') {
                pid = productIdFromLocalStorage
            }

            fetch(`${process.env.REACT_APP_BASE_URL}/deleteProductPhoto/${pid}/${photoId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        // If the response status is not ok, reject the promise with the error status text
                        return Promise.reject(`Error deleting photo Plz Keep Atleast one image`);
                    }
                })
                .then((data) => {
                    toast.success(data.message);
                    // Optionally, you can update the existingPhotos state after successful deletion
                    // setExistingPhotos(data.updatedProduct.photos);
                    fetchExistingPhotos();
                })
                .catch((error) => toast.error(error,+'Atleast one image must keep'));
        });

    };

    const handlePhotoSubmission = () => {
        if (newPhotos.length > 0) {
            // Filter out the selected photos to be removed
            const filteredNewPhotos = newPhotos.filter((_, index) => !selectedPhotoIds.includes(index));

            const formData = new FormData();
            filteredNewPhotos.forEach((file) => {
                formData.append('photos', file);
            });

            const productIdFromLocalStorage = localStorage.getItem('pId');

            fetch(`${process.env.REACT_APP_BASE_URL}/editProductPhotos/${productIdFromLocalStorage}`, {
                method: 'PUT',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Photos updated successfully:', data);
                    // Set existingPhotos to the updated photos
                    setExistingPhotos(data.updatedProduct.photos);
                    // Clear newPhotos and previewPhotos
                    setNewPhotos([]);
                    setPreviewPhotos([]);
                    // Clear selectedPhotoIds
                    setSelectedPhotoIds([]);
                    fetchExistingPhotos();
                })
                .catch((error) => console.error('Error updating photos:', error));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <ToastContainer />
            
            {/* Display existing and preview photos */}
            <Grid container spacing={1}>
                {existingPhotos.length === 0 ? (
                    <div>
                        {/* Display an error or a message when existingPhotos is empty */}
                        <p>No photos available.</p>
                    </div>
                ) : (
                    existingPhotos.map((photo, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Card style={{ width: '80%', height: '80%' }}>
                                <CardMedia
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    component="img"
                                    // Set 'width' to 'auto' for responsiveness
                                    image={photo.url}
                                    alt={`Product ${index + 1}`}
                                />
                            </Card>
                            <IconButton onClick={() => handleDelete(index, photo._id)} color="secondary">
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    ))
                )}

                {previewPhotos.map((photo, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <Card style={{ width: '80%', height: '80%' }}>
                            <CardMedia
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                component="img"
                                // Set 'width' to 'auto' for responsiveness
                                image={photo}
                                alt={`Preview ${index + 1}`}
                            />

                        </Card>
                        <IconButton onClick={() => handleDelete(index, index)} color="secondary">
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                ))}
            </Grid>
            <div style={{ padding: '10px' }}>
                {/* Input to upload new photos */}
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    key={fileInputKey} // Change the key to reset the input
                    style={{ display: 'none' }} // Hide the default input
                    id="fileInput" // Add an ID for the custom label
                />
                <label htmlFor="fileInput">
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<AddPhotoAlternateIcon />}
                    >
                        Add Photos
                    </Button>
                </label>

                {/* Add some space between the buttons */}
                <span style={{ padding: '0 10px' }} />

                {/* Button to submit new photos */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePhotoSubmission}
                >
                    Submit Photos
                </Button>
            </div>
        </div>
    );
};

export default ProductImageUpdation;
