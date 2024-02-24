import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import styled from 'styled-components';
import { Wrapper } from './addProductWrapper';
import { useParams } from 'react-router-dom';
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-left: 10px;
`;

const Th = styled.th`
  padding: 12px;
  background-color: #f2f2f2;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  margin-left: 10px;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
`;

const StyledLink = styled(Link)`
  color: #007bff; /* Change the link color */
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;


const RefundList = () => {
  const [refundData, setRefundData] = useState([]);
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/allRefundData`);
        setRefundData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilter = () => {
    const filteredData = refundData.filter((item) => {
      const orderIdMatch =
        !orderIdFilter || (item.orderId && item.orderId.includes(orderIdFilter));
      const statusMatch = !statusFilter || item.status === statusFilter;
      return orderIdMatch && statusMatch;
    });

    return filteredData;
  };

  return (
    <div className='single'>
      <Sidebar />
      <div className='singleContainer'>
        <Navbar />
        <Wrapper>
          <Input
            type='text'
            placeholder='Order ID'
            value={orderIdFilter}
            onChange={(e) => setOrderIdFilter(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value=''>All Status</option>
            <option value='Requested'>Requested</option>
            <option value='Refunded'>Refunded</option>
            <option value='Processing'>Processing</option>
          </Select>

          <Table>
            <thead>
              <tr>
                <Th>Order ID</Th>
                <Th>Trancation ID</Th>
                <Th>Name</Th>
                <Th>Contacts</Th>
                <Th>Status</Th>
                {/* Add more headers based on your data */}
              </tr>
            </thead>
            <tbody>
              {handleFilter().map((item) => (
                <tr key={item._id}>
                  <Td>
                    <StyledLink to={`/refundform/${item.orderId}`}>
                      {item.orderId}
                    </StyledLink>
                  </Td>
                  <Td>{item.transactionId}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.phone}</Td>
                  <Td>{item.status}</Td>
                  {/* Add more cells based on your data */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Wrapper>
      </div>
    </div>
  );
};

export default RefundList;
