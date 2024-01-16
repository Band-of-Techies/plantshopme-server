import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Product = ({ setIsDelete, photos, title, price, _id, flashSaleInfo, pots, allLengths, category, maincategory, subcategory, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);


  // Store the _id in local storage
  const handlelocal = async () => {
  localStorage.setItem('pId', _id);
  localStorage.setItem('PNAMES', title);
  // window.location.href = `/update-product/${_id}/${title}`;

  }
  useEffect(() => {



  }, []);
  const handleDelete = async () => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this product?');

    // If the user clicks "Cancel," do nothing
    if (!isConfirmed) {
      return;
    }

    setIsDelete(true);

    try {
      console.log('Deleting product...');
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteProduct/${_id}`);
      console.log('Product deleted successfully!');
      setIsDelete(false);
      window.alert('Product deleted successfully!');
      onDelete(_id);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      console.log('Finished delete operation');
      setIsDelete(false);
    }

  };


  return (
    <Wrapper>
      <img src={photos[0].url} alt="product" />
      <p>{title}</p>
      <p>{price}</p>
      <div className='btn btn-container'>
        <Link to={`/update-product/${_id}/${title}`} onClick={handlelocal} className='btn btn-update'>
          View & Update
        </Link>
        <button onClick={handleDelete} className='btn btn-delete' disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Wrapper>
  );
};

export default Product;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 2rem;
  img {
    width: 216px;
    height:260px;
  }
  p {
    width: 85%;
  }
  .btn-container {
    width: 85%;
    display: flex;
    justify-content: space-between;
  }
  .btn {
    border: none;
    padding: 0.15rem 0.35rem;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 5px;
    background: transparent;
  }
  .btn-update {
    font-weight: 700;
    color: #228f47;
    text-decoration: none; /* Remove default Link text decoration */
  }
  .btn-update:hover {
    background: #d1f6e5;
    transition: all 0.2s;
  }
  .btn-delete:hover {
    background: #fdc0c0;
    transition: all 0.2s;
  }
  .btn-delete {
    font-weight: 700;
    color: #d71313;
  }
`;