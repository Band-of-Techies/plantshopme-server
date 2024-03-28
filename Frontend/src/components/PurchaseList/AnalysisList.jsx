import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import { PieChart, Pie, Cell, Legend } from 'recharts'; // Importing components from recharts

const AnalysisList = () => {
    const [orderData, setOrderData] = useState([]);
    const { response } = useParams();
    const [mostSoldProduct, setMostSoldProduct] = useState(null);
    const [mostProfitableProduct, setMostProfitableProduct] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const responseData = await axios.get(`${process.env.REACT_APP_BASE_URL}/get-purchaseList?orderIds=${response}`);
                setOrderData(responseData.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (response) {
            fetchOrderData();
        }
    }, [response]);

    // Calculate most sold product
    useEffect(() => {
        if (orderData.length > 0) {
            const mostSold = orderData.reduce((prev, current) => (prev.count > current.count ? prev : current));
            setMostSoldProduct(mostSold);
        }
    }, [orderData]);

    // Calculate most profitable product
    useEffect(() => {
        if (orderData.length > 0) {
            const mostProfitable = orderData.reduce((prev, current) => {
                const prevProfit = prev.count * prev.productPrice;
                const currentProfit = current.count * current.productPrice;
                return prevProfit > currentProfit ? prev : current;
            });
            setMostProfitableProduct(mostProfitable);
        }
    }, [orderData]);

    // Prepare data for the pie chart
    const data = orderData.map(order => ({
        name: order.productName,
        value: order.count
    }));

    const COLORS = ['#FF5733', '#33FF57', '#5733FF', '#33BFFF', '#FF33BF', '#FFFF33'];

    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '50%', paddingLeft: '10px' }}>
                        <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                            {orderData.map(order => (
                                <div key={order.productId} style={{ marginBottom: '10px' }}>
                                    <h3 style={{ fontSize: '14px', margin: '0' }}>Product Name: {order.productName}</h3>
                                    <p style={{ fontSize: '12px', margin: '0' }}>Dimensions: {order?.dimensionValues?.Value1}{order?.dimensionValues?.Value2}</p>
                                    <p style={{ fontSize: '12px', margin: '0' }}>Product Price: {order.productPrice}</p>
                                    <p style={{ fontSize: '12px', margin: '0' }}>Count: {order.count}</p>
                                    <p style={{ fontSize: '12px', margin: '0' }}>Total Quantity: {order.totalQuantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ width: '50%', paddingRight: '10px' }}>
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <PieChart width={500} height={600}>
                                <Pie
                                    data={data}
                                    dataKey='value'
                                    nameKey='name'
                                    cx='50%'
                                    cy='50%'
                                    outerRadius={80}
                                    fill='#8884d8'
                                    label
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                            <div style={{ marginTop: '20px' }}>
                    {mostSoldProduct && (
                        <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                            <h3>Most Sold Product</h3>
                            <p>Name: {mostSoldProduct.productName}</p>
                            <p>Count: {mostSoldProduct.count}</p>
                        </div>
                    )}
                    {mostProfitableProduct && (
                        <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                            <h3>Most Profitable Product</h3>
                            <p>Name: {mostProfitableProduct.productName}</p>
                            <p>Profit: {mostProfitableProduct.count * mostProfitableProduct.productPrice}</p>
                        </div>
                    )}
                </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AnalysisList;
