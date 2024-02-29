import React, { useState } from 'react'
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import moment from 'moment';
import { useRef } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import {formatISO9075} from "date-fns"


const AllBlogs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState([]); // Ensure blog is initialized as an array

  // Function to fetch all blogs
  const getAllBlogs = async () => {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/post`);
      setBlog(resp.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const handleButton = (prop) => {
    navigate(`/blogs/edit-post/${prop._id}`);
  };

  // Helper function to format date and time
  const formatDateTime = (dateTime) => {
    return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
  };

  // Helper function to remove HTML tags from summary
  const removeHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    
      <div className='single'>
        <Sidebar />
        <div class='singleContainer'>
          <Navbar />
        {/* Sidebar and Navbar components */}
        <MainWrapper>
          <Wrapper>
            <div className='header-div'>
              <h4>Recent Posts</h4>
            </div>
            <div className='post-container'>
              {/* Check if blog is an array before mapping over it */}
              {Array.isArray(blog) && blog.length > 0 ? (
                blog.map((blogs, idx) => {
                  const { _id, title, summary, cover, content, createdAt, author, photo, tags } = blogs;
                  return (
                    <><div className="post" key={idx}>
                      <img src={blogs.photo.url} onClick={handleButton(blogs)} alt="bolg"></img>
                    </div></>
                  );
                })
              ) : (
                <div>No blogs available.</div>
              )}
            </div>
          </Wrapper>
        </MainWrapper>
      </div>
    </div>
  );
}

export default AllBlogs;

const MainWrapper = styled.div`
width:100%;
background:#F5F7F8;
padding-top:2rem;
padding-bottom:2rem;
`

const Wrapper = styled.section`
 width:95%;
 margin: 0 auto;
 min-height:60vh;
 background:#fff;
 padding:1rem;
 border-radius:5px;
 .texts a,
 .texts p,
 .texts h5 {
   text-decoration: none;
   padding:0rem 0.25rem;
 }
 
 .post-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(355px, 1fr));
  gap: 2rem;
  justify-content: center;
  margin: 0 auto;
  min-height: 60vh;
  margin-bottom:2.5rem;
}
 .header-div{
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    gap:1rem;
    margin:1rem 0;
    h4{
      margin:0;
      font-weight:600;
      border-bottom: 2px solid #228f47;
    }
 }
 .tags{
  display:flex;
  flex-wrap:wrap;
  flex-direction:row;
  gap:0.5rem;
  margin-top:0.5rem;
  padding-left:0.25rem;
 }
 .tag{
  background:#66bf84;
  padding:0.15rem .35rem !important;
  font-size:14px;
  color:#fff;
  border-radius:5px;
  text-transform:capitalize;
 }
 .header-link{
  display:flex;
  flex-direction:row;
  gap:1rem;
  justify-content:center;
  align-items:center; 
  text-transform:capitalize;
  a:hover{
    color:#66bf84;
    transition:color 0.3s;
  }
 }
 
 a{
  color:black;
 }
 .author{
  font-weight:500;
 }
 .time{
  color:#228f47;
  font-size:13px;
  margin-top:0.25rem;
 }
 .info{
  font-size:13px;
  padding:0 !important;
  margin-top:0.25rem;
  margin-bottom:0.25rem !important;
 }
 .summary{
  text-align: justify;
  font-size:14px;
  margin: 0.75rem 0;
  line-height:1.5;
 }
 .btn-read-more{
  margin-bottom:auto;
  margin-left:0.65rem !important;
  margin-bottom:0.5rem !important;
  padding:0.25rem 0.25rem !important;
  color:#228f47;
  font-weight:600;
  width:80px;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:14px;
  border-radius:5px;
  svg{
    font-size:1rem;
  }
 }
 .btn-read-more:hover{
  background:#ADEBC6;
 }
h5{
  font-size:15px;
  font-weight:600;
  color:black  !important;
  text-align: justify;
  padding:0;
  margin-top:0.45rem;
  margin-bottom:0.35rem !important;
  padding-left:0.25rem;
}
.post {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 495px;
  border: 1px solid #f9f9f9;
  border-radius: 5px;
  padding: 0.25rem;
  box-sizing: border-box;
 
}
.post:hover{
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
p{
  margin:0;
  padding:0;
}
.image {
  width: 100%;
  height: 180px; 
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; 
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}



.texts {
  width:100%; 
  background-color: #f9f9f9; 
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  height:60%;
}
@media(max-width:1280px){

}

@media (max-width: 768px) {
  .post {
    width: 100%;
  }
}
@media(max-width:560px){
  .post{
    min-width:325px;
  }
  .header-div{
    margin:2rem 0rem 0.5rem 0.75rem;
  }
  h4{
    font-size:16px;
  }
  .tag{
    font-size:13px;
  }
  .summary{
    line-height:1.2;
   }
}

`