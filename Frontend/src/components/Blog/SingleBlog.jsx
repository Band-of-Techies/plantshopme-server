import React, { useState } from 'react'
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import moment from 'moment';
import { useRef } from 'react';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';


const SingleBlog = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const myRef = useRef(null);

  const [blog ,setBlog] =useState([])

const getSingleBlog =  async()=>{
  try {
    const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/post/${id}`)
    setBlog(resp.data)
    return resp.data
} catch (error) {
    return error
}
}

useEffect(()=>{
  getSingleBlog()
},[])
  const handleButton=(prop)=>{
    navigate(`/blogs/edit-post/${prop._id}`)
  }

const dateAndTime = (prop)=>{
  const formattedDateTime = moment(prop).format("YYYY-MM-DD HH:mm:ss");
  return formattedDateTime
}

const removeHtmlTags = (htmlString) => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
};
const previousRoute = ()=>{
  navigate('/blogs');
}

    return (
      <>
      <div className='single'>
        <Sidebar />
        <div className='singleContainer'>
        <Navbar />
        <MainSection>
         <Wrapper ref={myRef}>
        {/* <div className='inline'><Link to={`/blogs/edit_post/${blog._id}`} className='btn'>Edit</Link> */}
        {/* <button type="button" onClick={previousRoute} className='cancel-btn'>Back</button></div> */}
        <div className='image'>
        <img src={blog.photo?.url} alt="blog" className='blog-img'/>
        </div>
        <div className='details-div'>
          <h4>{blog.title}</h4>
          <div><p className='title'>{blog.author?.name}</p><p className='date'>{dateAndTime(blog.createdAt)}</p></div>
          <div className='tags' style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem' }}>
            {blog.tags && blog.tags.map((tag, idx) => (
            <p key={idx} className='tag' style={{ background: 'var(--green-500)', padding: '0.1rem 0.5rem', fontSize: '14px', color: '#fff', borderRadius: '5px', textTransform: 'capitalize' }}>
            {tag}
            </p>
             ))}
          </div>
          <div className='summary'>{blog.summary}</div>
          <div className='content'>{removeHtmlTags(blog.content)}</div>
        </div>
        <Link to={`/blogs/edit-post/${blog._id}`} className='btn'>Edit</Link>
      </Wrapper>
      </MainSection>
      </div>
      </div>
       </>
    )
}

export default SingleBlog

const MainSection = styled.section`
    width:100%;
    background:#F5F7F8;
    padding-top:2rem;
    padding-bottom:2rem;
`

const Wrapper = styled.div`

 width:75%;
 margin:0 auto;
 display:flex;
 padding:1rem;
 background:#fff;
 flex-direction:row;
 flex-wrap:wrap;
 margin-top:2rem;
 margin-bottom:3rem;
 gap:2rem;
 min-height:60vh;

 .image {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.cancel-btn{
  padding:0;
    margin:0;
    cursor:pointer;
}
.blog-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn{

}
.tags{
  margin-top:0.5rem;
}
 p{
  margin:0;
  padding:0;
 }
 .summary{
  font-weight:500;
  text-align: justify;
  margin:0.75rem 0rem;
 }

 .details-div{
  display:flex;
  flex-direction:column;
  width:100%;

  div{
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start;
   
    .title{
      font-size:15px;
    }
    .date{
      font-size:13px;
      color:var(--grey-200);
    }
  }
 }
.content{
  width:100%;
  text-align: justify;
  margin-bottom:0.75rem;
}
.inline{
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  button{
    border:none;
    background:transparent;
    cursor: pointer;
  }
}
 .btn {
  margin-top:1rem;
  font-weight:500;
  background:#228f47;
    padding:0.5rem 0.75rem;
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
    text-transform:uppercase;
  }
  
  .btn:hover {
    box-shadow:  0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
a{
  text-decoration:none !important;
}
@media(max-width:1140px){
  .image {
    width: 100%;
    height: auto;
  }
  
  .blog-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
@media(max-width:560px){
  width:95%;
  gap:1rem;
  margin-bottom:0.5rem;
  h4{
    font-size:16px;
    font-weight:600;
  }
  .content{
    font-size:14px;
  }
}
`