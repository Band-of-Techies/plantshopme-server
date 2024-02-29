import React from 'react'
import Sidebar from '../../sidebar/Sidebar'
import Navbar from '../../navbar/Navbar'
import SelectedProduct from './SelectedProducts'
import ProductUpdateForm from './ProductUpdateForm;'
const updateProduct = () => {
    return (
        <div className='single' style={{ overflowY: 'hidden', maxHeight: 'auto'}}>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar /><br></br>

            
        <div style={{ overflowY: 'auto', maxHeight: '640px' }}>

                <ProductUpdateForm />
            </div>

            </div></div>
        
    )
}

export default updateProduct