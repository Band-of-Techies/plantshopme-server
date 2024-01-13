import React, { useState, useEffect } from 'react';
import { MainWrapper, Wrapper } from '../ProductAdd/addProductWrapper';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import {
    Button,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    CircularProgress,
    TableContainer,
    TablePagination,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewCoupons = () => {
    const [loading, setLoading] = useState(true);
    const [coupons, setCoupons] = useState([]);
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchCoupons = async () => {
        try {
            setLoading(true);

            // Prepare the filter parameters (empty for initial fetch)
            const filters = {
                startDate: '',
                endDate: '',
            };

            // Send a GET request with the filter parameters
            const response = await axios.get('https://admin.myplantstore.me/api/GetAllCoupons', {
                params: filters,
            });

            // Update the coupons state with the fetched data
            setCoupons(response.data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleFilter = async () => {
        try {
            setLoading(true);

            // Prepare the filter parameters
            const filters = {
                startDate: startDateFilter,
                endDate: endDateFilter,
            };

            // Send a GET request with the filter parameters
            const response = await axios.get('https://admin.myplantstore.me/api/GetAllCoupons', {
                params: filters,
            });

            // Update the coupons state with the filtered data
            setCoupons(response.data);
        } catch (error) {
            console.error('Error fetching filtered coupons:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <MainWrapper>
                    <Wrapper>
                        <div style={{ marginBottom: '20px', paddingTop: '30px' }}>
                            <TextField
                                label="Start Date"
                                type="date"
                                value={startDateFilter}
                                onChange={(e) => setStartDateFilter(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                style={{ marginRight: '10px' }}
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                value={endDateFilter}
                                onChange={(e) => setEndDateFilter(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                style={{ marginRight: '10px' }}
                            />
                            
                            <Button variant="contained" color="success" onClick={handleFilter}>
                                Filter
                            </Button>

                        </div>

                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Code</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Value</TableCell>
                                            <TableCell>Usage</TableCell>
                                            <TableCell>Start Date</TableCell>
                                            <TableCell>End Date</TableCell>
                                            <TableCell>Min Value</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {coupons
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((coupon) => (
                                                <TableRow key={coupon._id}>
                                                    <TableCell>{coupon.code}</TableCell>
                                                    <TableCell>{coupon.type}</TableCell>
                                                    <TableCell>{coupon.value}</TableCell>
                                                    <TableCell>{coupon.usage}</TableCell>
                                                    <TableCell>{coupon.startDate}</TableCell>
                                                    <TableCell>{coupon.endDate}</TableCell>
                                                    <TableCell>{coupon.minvalue}</TableCell>
                                                    <TableCell>
                                                        <Link to={`/UpdateCoupons/${coupon._id}`}>
                                                            <Button variant="outlined" color="primary">
                                                                Update
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={coupons.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableContainer>
                        )}
                    </Wrapper>
                </MainWrapper>
            </div>
        </div>
    );
};

export default ViewCoupons;
