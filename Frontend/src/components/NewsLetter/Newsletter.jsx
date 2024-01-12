import { Wrapper } from './addProductWrapper';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    TextField,
    Button,
    TextareaAutosize,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const Newsletter = () => {
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState('');
    const [subscribers, setSubscribers] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const timerId = setTimeout(() => {
            fetchSubscribers();
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const fetchSubscribers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/all-subscribers`, {
                params: {
                    username: searchTerm,
                },
            });
            setSubscribers(response.data);
        } catch (error) {
            console.error('Error fetching subscribers:', error.message || error);
        }
    };

    const handleCheckboxChange = (email) => {
        if (selectedEmails.includes(email)) {
            setSelectedEmails(selectedEmails.filter((e) => e !== email));
        } else {
            setSelectedEmails([...selectedEmails, email]);
        }
    };

    const handleSelectAll = () => {
        if (selectedEmails.length === subscribers.length) {
            setSelectedEmails([]);
        } else {
            setSelectedEmails(subscribers.map((user) => user.email));
        }
    };

    const handleSendContent = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/send-content`, {
                selectedEmails,
                subject,
                content,
            });

            if (response.status === 200) {
                setSnackbarSeverity('success');
                setSnackbarMessage('Content sent successfully!');
                setOpenSnackbar(true);
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage(`Error sending content: ${response.statusText}`);
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(`Error sending content: ${error.message || error}`);
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <Wrapper>
                    <TextField
                        label='Search by username'
                        variant='outlined'
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                    <div style={{paddingTop:'13px'}}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedEmails.length === subscribers.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subscribers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedEmails.includes(user.email)}
                                                onChange={() => handleCheckboxChange(user.email)}
                                            />
                                        </TableCell>
                                        <TableCell>{user.userName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    </div>
                    <TextField
                        value={subject}
                        label='Subject'
                        variant='outlined'
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ margin: '10px 0' }}
                    />

                    <TextareaAutosize
                        rowsMin={10}
                        placeholder='Type your content here...'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
                    />
                    <div>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleSendContent}
                            style={{ marginRight: '10px' }}
                        >
                            Send Content
                        </Button>
                    </div>
                </Wrapper>
            </div>

            {/* Snackbar for displaying messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert
                    elevation={6}
                    variant='filled'
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default Newsletter;
