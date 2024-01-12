import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stock.css';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import StockCategory from './StockCategory';
import styled from '@emotion/styled';

const Stock = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editStockDialogOpen, setEditStockDialogOpen] = useState(false);
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getLowStockProducts`);
      setLowStockProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      setLoading(false);
    }
  };

  const handleEditStockClick = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock.toString()); // Set the current stock in the dialog input
    setEditStockDialogOpen(true);
  };

  const handleEditStockSubmit = async () => {
    if (!selectedProduct || !newStock) {
      // Validation: Ensure product and stock are selected
      return;
    }

    try {
      const updatedProduct = { ...selectedProduct, stock: parseInt(newStock) };
      await axios.put(`${process.env.REACT_APP_BASE_URL}/updateProductStock/${updatedProduct._id}`, {
        stock: updatedProduct.stock,
      });

      // Close the dialog and update the stock in the table
      setEditStockDialogOpen(false);
      setLowStockProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className='single' >
      <Sidebar />
      <div className='singleContainer'>
        <Navbar />
        <Wrapper>
        <div className='update-container'>
          {/* Content Above Table */}
          <Grid item xs={12} >
            <div>
            <div>
              <h3>Low Stock Products</h3>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper} style={{overflowY: 'auto', maxHeight: '400px',paddingTop:'30px'}}>
                  <Table>
                    <TableHead>
                    <TableRow style={{ background: 'lightgreen', fontWeight: 'bold', fontSize: '25px' }}>
                        <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Title</TableCell>
                        <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Main Category</TableCell>
                        <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Category</TableCell>
                        <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Subcategory</TableCell>
                        <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Price</TableCell>
                        <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Stock</TableCell>
                        <TableCell  style={{ fontWeight: 'bold', fontSize: '16px' }}>Action</TableCell> {/* Add Action column */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lowStockProducts.map((product, index) => (
                        <TableRow key={index}>
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
              )}
            </div>
            </div>
          </Grid>
          {/* Table Section Below */}
          <Grid item xs={12} style={{paddingTop:'30px'}}>
            <StockCategory/>
          </Grid>
        </div>
        </Wrapper>
      </div>

      {/* Edit Stock Dialog */}
      <Dialog
        open={editStockDialogOpen}
        onClose={() => setEditStockDialogOpen(false)}
      >
        <DialogTitle>Edit Stock</DialogTitle>
        <DialogContent><div style={{paddingTop:'20px'}}>
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
      </Dialog>
    </div>
  );
};

export default Stock;


const Wrapper = styled.section`
   background:#F5F7F8;
   min-height:86vh;
   padding:1rem 1rem;
   .update-container{
    display:flex;
    flex-direction:column;
    background:#fff;
    min-height:78vh;
    padding:0.75rem;
    border-radius:5px;
   }
   h3{
    margin-top:0.5rem;
   }
`