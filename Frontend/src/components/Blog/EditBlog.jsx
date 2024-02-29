import React, { useState } from 'react'
import styled from 'styled-components'
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect } from 'react';
import Editor from './Editor';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';




const EditBlog = () => {
    const [blog,setBlog] =useState([])
    const {id} =useParams()

    const [title,setTitle] = useState('');
    const [summary,setSummary]=useState('');
    const [content,setContent] =useState('');
    const [files,setFiles] =useState('');
    const [userId,setUserId] = useState('')
    const [redirect,setRedirect] =useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchBlog = async () => {
        try {
          const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/post/${id}`);
          setBlog(resp.data);
          setTitle(resp.data?.title || '');
          setSummary(resp.data?.summary || '');
          setContent(resp.data?.content || '');
          setFiles(resp.data?.photo || '');
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchBlog();
    }, [id]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const data = new FormData();
      data.append('title', title);
      data.append('summary', summary);
      data.append('content', content);
      data.append('image', files[0]);
      data.append('id', id);
      data.append('author', userId);
  
      try {
        const resp = await axios.put(`${process.env.REACT_APP_BASE_URL}/post`, data);
        navigate(`/blogs/post/${id}`);
        return resp.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    };
  
    const handleCancel = (e, id) => {
      e.preventDefault();
      navigate(`/blogs/post/${id}`);
    };
    
  
    const handleDelete = async (event) => {
      console.log('run');
      event.preventDefault();
      try {
        const resp = await axios.delete(`${process.env.REACT_APP_BASE_URL}/post/${id}`);
        navigate('/blogs')
        return resp.data;
      } catch (error) {
        console.error(error);
        return error.response.data;
      }
    };
  
  const selectOptions = [
    { value: 'plant care', label: 'plant care' },
    { value: 'indoor plants', label: 'indoor plants' },
    { value: 'outdoor plants', label: 'outdoor plants' },
    { value: 'soil', label: 'soil' },
    { value: 'climate', label: 'climate' },
    { value: 'gifts', label: 'gifts' },
    { value: 'flowers', label: 'flowers' },
    
  ];

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



    return(
        <>
         <div className='single'>
        <Sidebar />
        <div className='singleContainer'>
        <Navbar />
       <MainSection>
        <Wrapper>
        <div className='inline'>
        <h4>Edit blog</h4>
        <button className='btn btn-cancel' onClick={(e) => handleCancel(e, id)}>Back</button>

        </div>
            <input  type="title" placeholder={'Title'} value={title} onChange={ev=> setTitle(ev.target.value)}/>
            <input type="summary"  placeholder={'Summary'}  value={summary}  onChange={ev => setSummary(ev.target.value)} />
            <CreatableSelect styles={customStyles} isMulti  options={selectOptions} className='creatable-select' />
            <input type="file"  onChange={ev => setFiles(ev.target.files)} className='file'/>
            <Editor value ={content} onChange={setContent}/> 
            <button className='btn btn-post' onClick={(e) => handleSubmit(e)}>UPDATE POST</button>

            <button className='btn btn-delete' onClick={handleDelete}>DELETE</button>
        </Wrapper>
        </MainSection>
        </div>
        </div>
        </>
    );
}

export default EditBlog

const MainSection = styled.section`
    width:100%;
    background:#F5F7F8;
    padding-top:2rem;
    padding-bottom:2rem;
`

const Wrapper = styled.form`
 width:92%;
 margin:0 auto;
 max-width:65vw;
 background:#fff;
 padding:0.75rem;
 border-radius:5px;
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
.creatable-select{
    margin-bottom:0.75rem;
}
.inline{
    display:flex;
    justify-content:space-between;
}
h4 {
    display: inline-block;
    border-bottom: 2px solid #228f47;
    margin-bottom:2rem;
}
.btn{
    border:none;
    background:transparent;
    margin:1rem 1.75rem 1rem 0rem;    
}
.file{
    border:none;
    font-family: inherit;
}
.btn-cancel{
    padding:0;
    margin:0;
    height:20px;
    cursor:pointer;

}
.btn-post{
    margin-top:1rem;
    font-weight:500;
    background:#228f47;
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
.btn-delete{
    margin-top:1rem;
    font-weight:500;
    background:#D71313;
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
.btn-post:hover {
    box-shadow:  0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
.btn-delete:hover {
    box-shadow:  0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`

