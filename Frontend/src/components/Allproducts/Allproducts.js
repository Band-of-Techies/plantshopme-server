import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Sidebar from '../sidebar/Sidebar'
import Navbar from '../navbar/Navbar'
import Product from './Product'
import Select from 'react-select';
import { GrFormPrevious,GrFormNext } from "react-icons/gr";
import { getAllCategories, separateCategories } from './getcategoryList'



//grid view of products
const Allproducts = () => {
    const [loading ,setLoading] =useState(false)
    const [allProducts ,setAllProduct] = useState([])
    const [pages,setPages]=useState(1)
    const [productCount,setProductCount] = useState(0)
    const [allCategories,setAllCategories] = useState([])
    const[level1 ,setLevel1] = useState([])
    const[level2 ,setLevel2] = useState([])
    const[level3 ,setLevel3] = useState([])
    const[level4 ,setLevel4] = useState([])
    const [searchName ,setSearchName] = useState('mainCategory')
    const defaultInitialState = {
      search: " ",
      mainCategory: "",
      category: "",
      subCategory: "",
      sort: "",
      max_price: "",
      min_price: "",
      price: "",
      page: 1,
      featureTag:""
    };
    const [initialState, setInitialState] = useState(defaultInitialState);
    const [isDelete,setIsDelete] =useState(false)

   
    const getProducts = async () => {
      setLoading(true);
      let url = `${process.env.REACT_APP_BASE_URL}/getAllProducts?maincategory=${encodeURIComponent(initialState.mainCategory)}&category=${encodeURIComponent(initialState.category)}&subcategory=${encodeURIComponent(initialState.subCategory)}&sort=${initialState.sort}&page=${initialState.page}&min_price=${initialState.min_price}&max_price=${initialState.max_price}&FeatureTag=${initialState.featureTag}`;
  
      if (initialState.search) {
          url = url + `&search=${initialState.search}`;
      }
  
      try {
          const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
          const resp = await axios.get(url, {
              headers: {
                  'Authorization': `${token}`, // Include the token in the Authorization header
              },
          });
  
          setLoading(false);
          setPages(resp.data.numOfPages);
          setProductCount(resp.data.totalProducts);
          setAllProduct(resp.data.products);
          return resp.data;
      } catch (error) {
          setLoading(false);
          return error;
      }
  };
  

   useEffect(()=>{
    getProducts()

   },[initialState.category,initialState.subCategory,initialState.mainCategory,initialState.search,initialState.page,isDelete,initialState.featureTag])

  const fetchFeatureTag = async()=>{
    try {
      // getFeatures
      const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/getFeatures`)
      setLevel4(resp.data);
      return
    } catch (error) {
      return error
    }
  }
  
   useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const categoriesData = await getAllCategories();
  
        setAllCategories(categoriesData);
        const data = separateCategories(categoriesData);
        setLevel1(data.level1);
        setLevel2(data.level2);
        setLevel3(data.level3);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };
    fetchFeatureTag()
    fetchData();
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount
  
  let subOption;
  
  if (searchName === 'mainCategory') {
    subOption = level1;
  } else if (searchName === 'category') {
    subOption = level2;
  }else if (searchName === 'FeatureTag'){
    subOption = level4;
  }
   else {
    subOption = level3;
  }
  
 
   const options = [
    { value: 'mainCategory', label: 'mainCategory' },
    { value: 'category', label: 'category' },
    { value: 'subCategory', label: 'subCategory' },
    { value: 'FeatureTag', label: 'FeatureTag' },
  ];



const [pageNo, setPageNo] = useState(initialState.page);

const handleNext = (prop) => {
  let newPageNo = pageNo;


  if (prop === 'next' && initialState.page !== pages) {
    newPageNo = pageNo + 1;
  } else if (prop === 'prev' && initialState.page > 1) {
    newPageNo = pageNo - 1;
  } else if (!isNaN(prop)) {
    newPageNo = prop;
  }

  setInitialState((prevState) => ({
    ...prevState,
    page: newPageNo,
  }));

  setPageNo(newPageNo);
};

  const handleInput = (e) => {
    const newSearchValue = e.target.value;
    setInitialState((prevState) => ({
      ...prevState,
      search: newSearchValue,
    }));
  };

const handleSelectInput = (selectedValue) => {
  setSearchName(selectedValue)
};


  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '100%',
      minWidth: '200px',
      maxWidth: '100%',
      height: 40,
      borderRadius: 5,
      borderColor: '#d9e2ec',
      boxShadow: state.isFocused ? '0 0 0 1px #d9e2ec' : null,
      "&:hover": {
        borderColor: '#d9e2ec',
      },
      marginLeft: '0',
      marginRight: '12px',
    }),
    input: (provided) => ({
      ...provided,
      readOnly: 'true',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: 12,
      textAlign: 'left',
      padding: '8px',
      backgroundColor: state.isDisabled
        ? null
        : state.isSelected
        ? '#66bf84'
        : state.isFocused
        ? '#e2fee2'
        : null,
      "&:active": {
        backgroundColor: '#66bf84',
      },
      outline: state.isFocused ? 'none' : null,
    }),
    menu: (provided) => ({
      ...provided,
      width: '100%',
      maxWidth: '100%', 
      minWidth: '200px',
    }),
    placeholder: (provided) => ({
      ...provided,
      textAlign: 'left',
    }),
    singleValue: (provided) => ({
      ...provided,
      textAlign: 'left',
      fontSize: 13,
    }),
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectChange = (prop) => {
    setSelectedOption(prop);
    if (searchName === 'mainCategory') {
      setInitialState((prevState) => ({
        ...prevState,
        mainCategory: prop.label,
        category: defaultInitialState.category,
        subCategory: defaultInitialState.subCategory,
        sort: defaultInitialState.sort,
        max_price: defaultInitialState.max_price,
        min_price: defaultInitialState.min_price,
        price: defaultInitialState.price,
        page: defaultInitialState.page,
        featureTag: defaultInitialState.featureTag
      }));

    } else if (searchName === 'category') {
      setInitialState((prevState) => ({
        ...prevState,
        category: prop.label,
        mainCategory: defaultInitialState.mainCategory,
        subCategory: defaultInitialState.subCategory,
        sort: defaultInitialState.sort,
        max_price: defaultInitialState.max_price,
        min_price: defaultInitialState.min_price,
        price: defaultInitialState.price,
        page: defaultInitialState.page,
        featureTag: defaultInitialState.featureTag
      }));
    } else if (searchName === 'FeatureTag') {
      setInitialState((prevState) => ({
        ...prevState,
        featureTag: prop.label,
        mainCategory: defaultInitialState.mainCategory,
        category: defaultInitialState.category,
        subCategory: defaultInitialState.subCategory,
        sort: defaultInitialState.sort,
        max_price: defaultInitialState.max_price,
        min_price: defaultInitialState.min_price,
        price: defaultInitialState.price,
        page: defaultInitialState.page
      }));
    } else {
      setInitialState((prevState) => ({
        ...prevState,
        subCategory: prop.label,
        mainCategory: defaultInitialState.mainCategory,
        category: defaultInitialState.category,
        sort: defaultInitialState.sort,
        max_price: defaultInitialState.max_price,
        min_price: defaultInitialState.min_price,
        price: defaultInitialState.price,
        page: defaultInitialState.page,
        featureTag: defaultInitialState.featureTag
      }));
    }
  };

 
  const handleReset = ()=>{
    setInitialState(defaultInitialState);
  }

// if(loading){
//     return(
//         <div className='single'>
//     <Sidebar />
//      <div className='singleContainer'>
//       <Navbar />
//        <div>
//         <h4>Loading</h4>
//       </div>
//       </div>
//     </div>
//     )
// }


  return (
    <>
    <div className='single'>
    <Sidebar />
     <div className='singleContainer'>
    <Navbar />
    < MainWrapper>
     <Wrapper>
      
      <h3>All Products</h3>
      <section className='filters'>
      <input type='text' placeholder='Search here' name="search" onChange={(e) => handleInput(e)}/>
      <Select options={options} className="sort-input" styles={customStyles} isSearchable={false} defaultValue={options[0]}
      onChange={(selectedOption) => handleSelectInput(selectedOption.value)} />
     <Select
        id="level1Select" className="sort-input"  styles={customStyles}
        value={selectedOption}
        onChange={handleSelectChange}
        options={subOption && subOption.map((item) => ({
          value: item.id ? item.id : item.level ,
          label: item.name
        }))}
      />

      <button className='search-btn' onClick={handleReset}>Reset</button>
      <div className='count-div'><span>Products count</span><p className='count'>{productCount}</p></div>

      </section>
      <div className='line'></div>
      {loading ? <p className='loading'>Loading....</p>:<div className="products-container">
      {Array.isArray(allProducts) &&
        allProducts.map((product) => {
        return <Product key={product.id} {...product}  setIsDelete={setIsDelete}/>;
      })}
    </div>}
    <div className='page-btns'>

    {((pages && pages>1)) && (!loading) && <div className='page-btns'>
     <button className='btn-prev' onClick={()=>handleNext('prev')}><GrFormPrevious /> prev</button>
     {[...Array(pages).keys()].map((num) => {
      if (num === 0 || num === pages - 1 || Math.abs(initialState.page - num - 1) <= 2) {
        return (
          <button  key={num}   onClick={() => handleNext(num + 1)}  className={`btn-no ${initialState.page === num + 1 ? 'highlight' : ''}`}>
            {num + 1}
          </button>
        );
      } else if (num === 1 || num === pages - 2) {
        return <span key={num}>…</span>;
      } else {
        return null;
      }
    })}
    <button onClick={()=>handleNext('next')} className='btn-next'>next<GrFormNext/></button></div>}

    </div>
  </Wrapper>
  </MainWrapper>
  </div>
  </div>
  </>
  )
}


export default Allproducts

const MainWrapper =styled.section`
background:#F5F7F8;
min-height:110vh;
margin:0;
padding:2rem 0rem;
`

const Wrapper = styled.section`
width:95%;
margin:0 auto;
background:#fff;
min-height:82vh;
border-radius:5px;
h3{
  border-bottom:3px solid #228f47;
  text-transform:capitalize;
  display:inline-block;
  margin:1rem 0rem 1.5rem 1.25rem;
 }
  img {
    height: 220px;
  }

  .products-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap:1.75rem;
    width:100%;
    margin: 0 auto;
    min-height:40vh;
  }
  .line{
    width:97%;
    margin:0 auto;
    border-top:2px solid #F5F5F5;
   margin-top:2rem;
   margin-bottom:2rem;

   
  }
  .loading{
    margin-left:3rem;
  }
  .filters {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
   
    justify-content:center;
    align-items:left;
    margin-bottom: 1rem;
  
  }
  
  .sort-input,
  input {
    width: calc(33.33% - 2rem); 
    margin: 0 1rem 1rem 0; 
    
  }
  input{
    border:1px solid #d9e2ec;
    border-radius:5px;
  }
  .search-btn{
    margin-right:auto;
    margin-left:1.25rem;
    width:180px;
    border-radius:5px;
    font-size:16px;
    font-weight:500;
    background:#228f47;
    cursor: pointer;
    color: #fff;
    border: transparent;
    letter-spacing:1px;
    padding: 0.375rem 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition:  0.3s ease-in-out all;
    text-transform: capitalize;
    display: inline-block;
  }
  .btn-no{
    min-width:10px;
    border:none;
    background:transparent;
    cursor:pointer;
  }
  .highlight {
    color: #228f47;
    font-weight:bold;
    border-bottom:2px solid #228f47;
  }
  .count{
    width:100px;
    background:#CFFFCF;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:18px;
    color:#228f47;
    font-weight:bold;
    border-radius:5px;
    height:30px;

  }
  .count-div{
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:row;
    margin-right:2.5rem;
    span{
      font-weight:600;
    }
  }
  .page-btns{
    margin-top:2.5rem;
    display:flex;
    flex-direction:row;
    justify-content:center;
    gap:1rem;
    width:100%;
    margin-bottom:2rem;
    
  }
  .btn-prev,.btn-next{
      background:#228f47;
      width:100px;
      padding:0.35rem;
      border-radius:10px;
      border:none;
      color:#FFF;
      font-weight:600;
      display:flex;
      justify-content:center;
      align-items:center;
      svg{
        font-size:1rem;
      }
  }
  @media (max-width: 1044px) {
    .products-container {
      max-width:500px !important;
    }
  }
  @media (max-width: 772px) {
    .products-container {
      max-width:500px !important;
    }
  }

@media (max-width: 665px) {
  .products-container {
      grid-template-columns: repeat(2, 1fr); 
      max-width:500px !important;
  }
}
@media (max-width: 556px) {
  .products-container {
    grid-template-columns: repeat(2, 200px); /* Set the width of child elements to 200px */
    grid-auto-rows: 1fr; /* Create 2 rows in each row */
    gap: 10%rem; /* Adjust the gap between items */
    justify-content:center;

  }
}
@media (max-width: 480px) {
  width:95%;
  .products-container {
    grid-template-columns: repeat(2, 160px); /* Set the width of child elements to 200px */
    grid-auto-rows: 1fr; /* Create 2 rows in each row */
    gap: 15%rem; /* Adjust the gap between items */
    justify-content:center;

  }
}
`


