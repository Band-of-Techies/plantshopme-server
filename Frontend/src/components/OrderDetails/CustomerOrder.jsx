import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import styled from 'styled-components';
import Skeleton from '@mui/material/Skeleton';
import PrintPage from './Invoice';
import { Wrapper } from './addProductWrapper';
import Mapfunction from '../Map/Mapfunction';
import SendEmailButton from './SendInvoice';

const CustomerOrder = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIntent, setSelectedIntent] = useState(null);
    let finalAmount = 0;
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [ulocation, setulocation] = useState(0);
        
        useEffect(() => {
            const fetchData = async () => {
              const token = localStorage.getItem('token');
              try {
                console.log('Fetching data...');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/get-payment-intent-by-id/${id}`, {
                  headers: {
                      'Authorization': `${token}`, // Include the token in the Authorization header
                  },
              });
      
                console.log('Fetched data:', response.data);
                
                setData(response.data);
                setSelectedIntent(response.data);
          
                if (response.data.updatedCartItems) {
                  console.log('Updating local storage...');
                  
                  const lat = response.data.GoogleLocation?.location?.lat || 0;
                  const lng = response.data.GoogleLocation?.location?.lng || 0;
                  const ulocation = response.data.GoogleLocation?.name || '';
                 setLat(lat);
                 setulocation(ulocation)
                 setLng(lng);
          
                  // Store lat and lng in local storage
                  localStorage.setItem('latitude', lat);
                  localStorage.setItem('longitude', lng);
          
                  let finalAmount = response.data.updatedCartItems.reduce((sum, cartItem) => {
                    const currentItemTotal = cartItem.dimension.Price * cartItem.amount;
                    return sum + currentItemTotal;
                  }, 0);
          
                  response.data.updatedCartItems.forEach((cartItem) => {
                    if (cartItem.GiftWrap) {
                      finalAmount += 20 * cartItem.amount;
                    }
                  });
          
                  console.log('Final Amount:', finalAmount);
          
                  // Update local storage with other relevant data if needed
                  // localStorage.setItem('key', 'value');
                }
              } catch (error) {
                console.error('Error fetching Order details:', error);
              } finally {
                // Simulate a delay of 1 second before setting loading to false
                setTimeout(() => {
                  console.log('Setting loading to false...');
                  setLoading(false);
                }, 1000);
              }
            };
          
            fetchData();
          }, [id]);
          

    if (loading) {
        return (
            <div className='single'>
                <Sidebar></Sidebar>
                <div className='singleContainer'>
                    <Navbar />
                    <MainWrapper>
                        <Wrapper>
                            <Skeleton animation="wave" height={50} width="100%" style={{ marginBottom: 10 }} />
                        </Wrapper>
                    </MainWrapper>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className='single'>
                <Sidebar></Sidebar>
                <div className='singleContainer'>
                    <Navbar />
                    <MainWrapper>
                        <Wrapper>
                            <p>No data available for the provided ID.</p>
                        </Wrapper>
                    </MainWrapper>
                </div>
            </div>
        );
    }
let Clientlocation=''
    if (data.updatedCartItems) {

        const lat = data.GoogleLocation?.location?.lat || 0;
        const lng = data.GoogleLocation?.location?.lng || 0;
        Clientlocation=data.GoogleLocation?.name;

        // Store lat and lng in local storage
        


        finalAmount = data.updatedCartItems.reduce((sum, cartItem) => {
            const currentItemTotal = cartItem.dimension.Price * cartItem.amount;
            return sum + currentItemTotal;
        }, 0);

        data.updatedCartItems.forEach((cartItem) => {
            if (cartItem.GiftWrap) {
                finalAmount += 20 * cartItem.amount;
            }
        });
    }

    return (
        <div className='single'>
            <Sidebar></Sidebar>
            <div className='singleContainer'>
                <Navbar />
                <MainWrapper>
                    <Wrapper>
                        {data &&
                            <>
                                {data.updatedCartItems.map((cartItem) => (
                                    <Item key={cartItem._id}>
                                        <ItemImage src={cartItem.image} alt={cartItem.title} />
                                        <ItemDetails>
                                            <ItemTitle>{cartItem.title}</ItemTitle>
                                            <p>Quantity: {cartItem.amount}</p>
                                            <p>Dimensions:</p>
                                            <p>{cartItem.dimension?.Field1}:{cartItem.dimension?.Value1}</p>
                                            <p>{cartItem.dimension?.Field2}:{cartItem.dimension?.Value2}</p>
                                            <p>Price: {cartItem.dimension?.Price}/Product</p>
                                            <p>Flash Sale Price:{cartItem.flashSalePrice || ''}</p>
                                            {cartItem.GiftWrap && (
                                                <div style={{ backgroundColor: 'yellow', padding: '5px', borderRadius: '5px' }}>
                                                    GiftWrap
                                                </div>
                                            )}
                                        </ItemDetails>
                                        <AdditionalDetails>
                                            {/* Additional details here */}
                                        </AdditionalDetails>
                                    </Item>
                                ))}
                                <ItemsWrapper>
                                    <CheckoutDetails>
                                        <h3>Checkout Data</h3>

                                        <p>Name: {data.checkoutData.name}</p>
                                        <p>Country: {data.checkoutData.country}</p>
                                        <p>State: {data.checkoutData.state}</p>
                                        <p>City: {data.checkoutData.city}</p>
                                        <p>House Number: {data.checkoutData.houseNumber}</p>
                                        <p>Land Mark: {data.checkoutData.landmark}</p>
                                        <p>Phone No: {data.checkoutData.phone}</p>
                                        <p>Note: {data.checkoutData.note}</p>
                                        

                                    </CheckoutDetails>
                                    <CouponDetails>
                                        <h3>Coupon Data </h3>

                                        <p>Code: {data.couponData?.code || '-'}</p>
                                        <p>Type: {data.couponData?.type || '-'}</p>
                                        <p>Value: {data.couponData?.value || '-'}</p>
                                        <p>Usage: {data.couponData?.usage || '-'}</p>

                                        
                                        
                                    </CouponDetails>
                                    <CoinDetails>
                                    <h3>Coins Data </h3>
                                        <p>Coins: {data.coinsData?.code || '-'}</p>
                                        <p>Value: {data.coinsData?.value || '-'}</p>
                                    </CoinDetails>
                                    <OrderDetails>
                                        <h3>Order/Payment Details</h3>
                                        {/* Order/payment details here */}
                                        <p>Order Placed At: {data.createdAt}</p>
                                        <p>Payment Mode: {(isNaN((data?.paymentData?.amount / 100).toFixed(2)) ? (' Cash on Delivery') : ' Online payment')}</p>
                                        <p>Order Status:{data.Orderstatus}</p>
                                        <p>GrandTotal: {finalAmount}</p>
                                        <p>Shipping Fee: {data.shipping_fee}</p>
                                        <p>Delivery Location: {data.deliveryLocation}</p>
                                        <p>After Discount:{data.total}</p>
                                        {/* <p>After Discount:{(isNaN(data?.couponData?.value / 10) ? finalAmount : data.total)}</p> */}
                                        <StyledPrintPageContainer>
                                            <PrintPage intent={selectedIntent} />
                                           
                                        </StyledPrintPageContainer>
                                    </OrderDetails>
                                </ItemsWrapper>
                                <p>Customer Location:{Clientlocation}</p>
                                <Mapfunction lat={lat} lng={lng} ulocation={ulocation}/>
                            </>
                        }
                    </Wrapper>
                </MainWrapper>
            </div>
        </div>
    );
};

export default CustomerOrder;

const MainWrapper = styled.div`
  background: #f5f7f8;
  padding: 1rem;
  min-height: 86vh;
`;

const StyledPrintPageContainer = styled.div`
  border: 1px solid lightgreen;
  background-color: lightgreen;
  color: white;
  margin-top: 10px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const ItemTitle = styled.h3`
  margin-bottom: 10px;
`;

const AdditionalDetails = styled.div`
  flex: 1;
`;

const CheckoutDetails = styled.div`
  flex: 1;
`;

const CouponDetails = styled.div`
  flex: 1;
`;
const CoinDetails = styled.div`
  flex: 1;
`;

const OrderDetails = styled.div`
  flex: 1;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
