import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FlashSalesData = () => {
  const [flashSalesData, setFlashSalesData] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Set the number of rows per page to 5
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getFlashSalesDetails`);
      setFlashSalesData(response.data);
    } catch (error) {
      console.error('Error fetching flash sales data:', error);
    }
  };

  const handleRefresh  =async () =>
  {
    fetchData();
  }

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    fetchData();
  }, 400);

  }, []); // Fetch data when the component mounts

  const handleDelete = (flashSaleId) => {
    setDeleteConfirmation(flashSaleId);
  };

  const confirmDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/flash-sales/${deleteConfirmation}`)
      .then((response) => {
        // Handle success (optional)
        toast.success('Flash sale item deleted successfully:');
        fetchData(); // Refresh data after delete
      })
      .catch((error) => {
        // Handle error (optional)
        toast.error('Error deleting flash sale item:', error);
      })
      .finally(() => {
        setDeleteConfirmation(null);
      });
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleUpdate = (flashSaleId, updatedData) => {
    // Check if StartDate exists and is not empty
    if (updatedData.StartDate) {
      // Ensure the StartDate is in the correct format (yyyy-MM-dd)
      updatedData.StartDate = updatedData.StartDate.split('T')[0];
    }
  
    axios
      .put(`${process.env.REACT_APP_BASE_URL}/flash-sales/${flashSaleId}`, updatedData)
      .then((response) => {
        // Handle success (optional)
        toast.success('Flash sale item updated successfully:');
        fetchData(); // Refresh data after update
      })
      .catch((error) => {
        // Handle error (optional)
        toast.error('Error updating flash sale item:', error);
      });
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  return (
    <div>
      <ToastContainer/>
      <Button variant="contained" onClick={handleRefresh}>Refresh</Button>
      <h1>Flash Sales Data</h1>
      {isLoading && <CircularProgress style={{ marginLeft: '10px' }} />}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Stock Available</TableCell>
              {/* <TableCell>Length</TableCell>
              <TableCell>Price</TableCell> */}
              <TableCell>Start Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Time Duration</TableCell>
              <TableCell>Offer (%)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flashSalesData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((flashSale, index) => (
                <TableRow key={index}>
                  <TableCell>{flashSale.flashSale.ProductName}</TableCell>
                  <TableCell>{flashSale.product.stock}</TableCell>
                  {/* <TableCell>{flashSale.product.length.join(', ')}</TableCell>
                <TableCell>{flashSale.product.price}</TableCell> */}
                  <TableCell>
                    <TextField
                      type="date"
                      value={flashSale.flashSale.StartDate ? flashSale.flashSale.StartDate.split('T')[0] : ''}
                      onChange={(e) => {
                        const updatedData = {
                          ...flashSale.flashSale,
                          StartDate: e.target.value,
                        };
                        handleUpdate(flashSale.flashSale._id, updatedData);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      value={flashSale.flashSale.StartTime}
                      onChange={(e) => {
                        const updatedData = {
                          ...flashSale.flashSale,
                          StartTime: e.target.value,
                        };
                        handleUpdate(flashSale.flashSale._id, updatedData);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      value={flashSale.flashSale.TimeInHours}
                      onChange={(e) => {
                        const updatedData = {
                          ...flashSale.flashSale,
                          TimeInHours: e.target.value,
                        };
                        handleUpdate(flashSale.flashSale._id, updatedData);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      value={flashSale.flashSale.OfferPercentage}
                      onChange={(e) => {
                        const updatedData = {
                          ...flashSale.flashSale,
                          OfferPercentage: e.target.value,
                        };
                        handleUpdate(flashSale.flashSale._id, updatedData);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(flashSale.flashSale._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={flashSalesData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />


      {/* Render ConfirmationDialog component */}
      {deleteConfirmation && (
        <ConfirmationDialog
          open={Boolean(deleteConfirmation)}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default FlashSalesData;
