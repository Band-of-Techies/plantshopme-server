import styled from '@emotion/styled';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Rolemanagement = () => {
    const [userType, setUserType] = useState('');
    const [roles, setRoles] = useState([]);
    const [allRoles, setAllRoles] = useState([]);

    // Fetch user details based on userType when the component mounts
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/CreateRoles/${userType}`);
                const data = await response.json();

                // Update state with user details
                setUserType(data.userType);
                setRoles(data.roles || []); // Ensure roles is an array even if it's null
            } catch (error) {
                console.error('Error fetching user details:', error.message);
            }
        };

        if (userType) {
            fetchUserDetails();
        }
    }, [userType]);

    // Fetch all roles when component mounts
    useEffect(() => {
        const fetchAllRoles = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/RolesType`);
                const data = await response.json();
                setAllRoles(data);
            } catch (error) {
                console.error('Error fetching all roles:', error.message);
            }
        };

        fetchAllRoles();
    }, []);

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        if (!roles.includes(selectedRole)) {
            setRoles([...roles, selectedRole]);
        } else {
            setRoles(roles.filter((role) => role !== selectedRole));
        }
    };

    const handleSubmit = async () => {
        try {
            const requestBody = { userType, roles: roles || [] }; // Ensure roles is an array, even if it's empty
            console.log('Request Body:', requestBody);

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/createRoles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            toast.success('Roles created/updated Successfully');
        } catch (error) {
            // Handle error response
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
        }
    };



    return (
        <div className='single'>
            <Sidebar></Sidebar>
            <ToastContainer />
            <div className='singleContainer'>
                <Navbar />
                <Wrapper>
                    <select onChange={handleUserTypeChange} value={userType}>
                    <option value="">Select User Type</option>
                        <option value="Admin">Admin</option>
                        <option value="Order Manager">Order Manager</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="SEO Specialist">SEO Specialist</option>
                        <option value="Marketing Manager">Marketing Manager</option>
                        <option value="Accountant">Accountant</option>
                    </select>

                    <div className="checkbox-group" style={{paddingTop:"50px",paddingBottom:'40px'}}>
                        {allRoles.map((role) => (
                            <div key={role._id}>
                                <input
                                    type="checkbox"
                                    onChange={handleRoleChange}
                                    value={role.RolesTypes}
                                    checked={roles.includes(role.RolesTypes)}
                                />
                                <label>{role.RolesTypes}</label>
                            </div>
                        ))}
                    </div>
<div></div>
                    <button onClick={handleSubmit}>Submit</button>
                </Wrapper>
            </div>
        </div>
    );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding:50px;

  select {
    margin-bottom: 1rem;
  }

  div {
    margin-bottom: 1rem;
    paddingBotton:30px;
    
  }

  label {
    margin-left: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  /* Arrange checkboxes in a row with a maximum of 5 items per row */
  div.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  div.checkbox-group > div {
    width: 26%; /* 100% / 5 items - some margin for spacing */
    margin-bottom: 1rem;
  }
`;


export default Rolemanagement;
