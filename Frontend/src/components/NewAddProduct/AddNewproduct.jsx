import React from 'react'

import Sidebar from '../sidebar/Sidebar'
import Navbar from '../navbar/Navbar'
import { Wrapper } from './addProductWrapper'
import CategoryList from './Category/CategoryList'

const AddNewproduct = () => {
  return (
    <div className='single'>
      <Sidebar></Sidebar>
      <div className='singleContainer'>
        <Navbar />
        <Wrapper>
          <CategoryList/>
        </Wrapper>
      </div>

    </div>
  )
}

export default AddNewproduct