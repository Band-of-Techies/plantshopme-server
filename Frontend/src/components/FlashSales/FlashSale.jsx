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
import ProductSelection from './ProductSelection';
import FlashSalesData from './FlashSalesData';
import { Wrapper } from './addProductWrapper';

const FlashSale = () => {

    return (
        <div>
            <div className='single'>
                <Sidebar></Sidebar>
                <div className='singleContainer'>
                    <Navbar /><Wrapper>
                    <ProductSelection/>
                    </Wrapper>
                </div>
            </div>
        </div>
    )
}

export default FlashSale


