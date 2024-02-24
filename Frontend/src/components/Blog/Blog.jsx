import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import Navbar from '../navbar/Navbar'
import CreatableSelect from 'react-select/creatable';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Link, Navigate, useNavigate } from "react-router-dom";
import Editor from './Editor';
import styled from 'styled-components'
import axios, { Axios } from 'axios';

const Blog = () => {
    const selectOptions = [
        { value: 'plant care', label: 'plant care' },
        { value: 'indoor plants', label: 'indoor plants' },
        { value: 'outdoor plants', label: 'outdoor plants' },
        { value: 'soil', label: 'soil' },
        { value: 'climate', label: 'climate' },
        { value: 'gifts', label: 'gifts' },
        { value: 'flowers', label: 'flowers' },
        
      ];

      const [title,setTitle] = useState('');
      const [summary,setSummary]=useState('');
      const [content,setContent] =useState('');
      const [files,setFiles] =useState('');
      const [redirect,setRedirect] =useState(false);
      const [msg,setMsg] =useState(false);
    const navigate =useNavigate()
  
      const [selectedOptions, setSelectedOptions] = useState([]);
  
      const handleSelectChange = (selectedOptions) => {
          setSelectedOptions(selectedOptions);
      };
      const customStyles = {
          control: (provided, state) => ({
            ...provided,
            height: 44,
            borderRadius: 5,
            borderColor: '#d9e2ec',
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
              borderColor: '#d9e2ec'
            }
          }),
          valueContainer: (provided) => ({
              ...provided,
              padding: '0px 6px'
            }),
          input: (provided) => ({
            ...provided,
            paddingTop: 0,
            margin: '0px',
          }),
          placeholder: (provided) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
            color: '#627d98',
  
          }),
          menu: (provided) => ({
            ...provided,
            fontFamily: 'inherit',
          }),
          valueContainer: (provided) => ({
              ...provided,
              height: '44px', 
              padding: '0px 6px'
            }),
        };
        const customPlaceholder = (
          <div style={{ color: '#829ab1', fontFamily: 'inherit'  }}>
            Select tags...
          </div>
        );
        
        // console.log(selectedOptions);
      const handleSubmit = async(e)=>{
        e.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('summary', summary);
    data.append('content', content);
    data.append('image', files[0]); 
  
    // data.append('author', 'user0054568');
    data.append('tags', JSON.stringify(selectedOptions.map((color) => color.value)));
   
    if(title && summary && content && files){
        setRedirect(false)
        try {
            const resp =await axios.post(`${process.env.REACT_APP_BASE_URL}/api/post`,data)
            setRedirect(true)
            navigate('/blogs')
            return resp.data
        } catch (error) {
            setRedirect(true)
            setMsg('Fill all the fields...')
            return error
        }
    }
    else{

        setMsg('Fill all the fields...')
    }
}

useEffect(() => {
    if (msg !== '') {
      const timeoutId = setTimeout(() => {
        setMsg('');
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [msg]);


useEffect(()=>{

},[redirect])

    return (
        <div className='single'>
            <Sidebar />
            <div className='singleContainer'>
                <Navbar />
                <Wrapper>
                <form >
                <div className='inline'><h4>Post Blogs</h4><Link to="/blogs">All Blogs</Link></div>
                <input  type="title" placeholder={'Title'} value={title} onChange={ev=> setTitle(ev.target.value)} style={{paddingLeft: "0.5rem"}}/>
               <input type="summary"  placeholder={'Summary'}  value={summary}  onChange={ev => setSummary(ev.target.value)}  style={{paddingLeft: "0.5rem"}}/>
               <CreatableSelect styles={customStyles} isMulti placeholder={customPlaceholder} options={selectOptions} value={selectedOptions} onChange={handleSelectChange} />
               <input type="file"  onChange={ev => setFiles(ev.target.files)} className='file'/>
               <Editor value ={content} onChange={setContent}/> <button type="submit" onClick={handleSubmit} className='btn btn-post'>CREATE POST</button>
               {msg && <p className='warning'>{msg}</p>}
            </form>
            </Wrapper>
            </div>
        </div>
    )
}

export default Blog

const Wrapper = styled.form`
 width:100%;
 min-height:90vh;
background:#F5F7F8;
padding-top:1.5rem;
 form{
  width:75%;
  margin:0 auto;
  background:#fff;
  padding:1rem;
  border-radius:5px;
  margin-bottom:2rem;
 }
 input{
    font-family: inherit;
    height: 35px;
    padding: 5px;
    border: 1px solid #d9e2ec;
    border-radius: 5px;
    color: #627d98;
    font-size:16px;
    width:98%;
    margin-bottom:1rem;
    
  
}
h4 {
    display: inline-block;
    border-bottom: 2px solid #228f47;
    margin-bottom:2rem;
}
.inline{
    display:flex;
    justify-content:space-between;
}
.css-eu5275-placeholder{
    padding-bottom:0.55rem; 
}
.css-1acljee-control{
    font-family: inherit;
    height: 44px;
    border: 1px solid #d9e2ec;
    border-radius: 5px;
    color: #627d98;
    font-size:16px;
}
.css-1acljee-control:focus{
    border:none;
}
.css-1fdsijx-ValueContainer{
    height:44px;
}
.css-1vhxjqg-placeholder{
    margin-bottom:0.5rem;
}
.css-1p3m7a8-multiValue{
    margin-bottom:0.35rem;
}
.warning{
    margin-top:1rem;
    color:red;
}
.file{
    border:none;
    font-family: inherit;
    margin-top:0.75rem;
    margin-bottom:0.5rem;
}
.btn-post{
    margin-top:1rem;
    font-weight:500;
    background:#228f47;
    cursor:pointer;
    padding:0.5rem 0.75rem;
}
.multi-select {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .multi-select .react-select__input {
    font-family: inherit;
    height: 44px;
    padding: 5px;
    border: 1px solid #d9e2ec;
    border-radius: 5px;
    color: #228f47;
    font-size: 16px;
    width: 100%;
  }
  .btn {
    cursor: pointer;
    color: #fff;
    border: transparent;
    border-radius: 5px;
    letter-spacing:1px;
    padding: 0.375rem 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition:  0.3s ease-in-out all;
    text-transform: capitalize;
    display: inline-block;
  }
  
  .btn:hover {
    box-shadow:  0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

input:focus {
  outline: none;
  border-color: #d9e2ec;
}
@media (max-width: 520px) {
    width:90% !important;
  }
  
`