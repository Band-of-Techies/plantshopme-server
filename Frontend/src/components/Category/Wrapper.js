import styled from "styled-components";

export const  Wrapper = styled.div`
background:#F5F7F8;
.main-container {
    padding-top: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 200px;
    
  }
  .main-div{
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
    gap:3.3rem;
  }
  button{
    cursor:pointer;
  }
  label{
    color: green;
  }
  .main-div > * {
    max-width: 350px;
  }
  .image-show{
    display:flex;
    flex-direction:row;
    justify-content:space-between;
  }
  .image-preview{
    display:flex;
    flex-direction:column;
    margin-top:0.25rem;
    gap:0.25rem;
  }
  .delete-icon{
    color:rgb(245, 47, 47);
    cursor:pointer;
  }
  .save-btn{
    width:75px;
    background:#228f47;
    color:#fff;
    border:none;
    border-radius: 0px 5px 5px 0px;
    height:40px;
  }
  h3{
    border-bottom:3px solid #228f47;
    text-transform:capitalize;
    display:inline-block;
    margin:0rem 0rem 2rem 0rem;
   }
   .category-div {
    display: grid;
    grid-template-columns: 2fr 1fr; 
    margin-bottom:1rem;
  }
  button{
    width:20px;
  }

   .icon-img{
    width:100px;
    height:100px;
   }
  /* Styles for different screen sizes */
  @media (max-width: 600px) {
    .main-container {
      padding-left: 100px;
      padding-right: 10px;
    }
  }
  
  @media (min-width: 601px) and (max-width: 960px) {
    .main-container {
      padding-left: 20px;
      padding-right: 20px;
    }
  }


  
`