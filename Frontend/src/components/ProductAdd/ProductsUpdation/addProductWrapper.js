import styled from "styled-components";

 

 export const Wrapper  = styled.div`
   width:95%;
   margin:0 auto;
   margin-top:1.5rem;
   margin-bottom:3rem;
   h3{
    border-bottom:3px solid #228f47;
    margin-bottom:2rem;
    text-transform:capitalize;
    display:inline-block;
   }
   .first-div{
    display:flex;
    flex-direction:column;
    margin:0;
    padding:0;

   }
   .formFirst {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap:1rem;
    margin:0;
    padding:0;
}

.formFirst textarea, .formFirst input[type="file"] {
    width: 100%;
}

.formFirst input[type="text"] {
    width: 100%;
}
.formFirst textarea {
    width: 100%;
    min-height: 100px;
    border:1px solid #d9e2ec;
    border-radius:5px;
    padding:5px 10px;
    font-size:16px;
}
.formSecond{
    margin-top:0.75rem;
    padding-top:0;
}
.img-div{
    display:flex;
    flex-direction:row;
    gap:2rem;
    flex-wrap:wrap;
    height:100%;
    

}
.formThird{
    padding:0;
    margin:0;
    p{
        font-size:13px;
        color:grey;
    }
}
.image-container{
    margin-bottom:2rem;
}
.delete-icon{
    margin-top:1rem;
}
.formFour{

}
.category-row{
    display:flex;
    justify-content:space-between;
    flex-direction:row;
    flex-wrap:wrap;
    margin-top:1rem;
}
.product-price{
    width:100%;
    display:flex;
    margin-top:1.5rem;
    margin-bottom:1.75rem;
    gap:3.45rem;
    justify-content:left;
}
.dimensions {
    display: flex;
    flex-wrap: wrap; 
    justify-content: space-between;
    gap:2rem;
    input{
       height:20px;
    }
  }
  
  .dimensions > div {
    flex-basis: calc(30%); 
    margin-bottom: 10px; 
    
  }
  
  .selected-length {
    margin-top:0.5rem;
  }
  .select-multi{
    width:100%;
  }
  .length-price{
    div{
        display:flex;
        flex-direction:row;
        width:100%;
    }
  }
  .btn{
    width:200px;
    border-radius:0px 5px 5px 0px;
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
  .features-div{
    margin-bottom:2rem;
  }
  .plant-care-div{
    display:flex;
    flex-direction:column;
  }
  .care-type-div{
    display:flex;
    flex-direction:column;
  }
  .form{
    display:flex;
    gap:3rem;
  }
  .plantcares-div{
    margin-top:auto;
  }
  .plantcare-show {
    width:100%;
    display: flex;
    flex-direction: row;
  }
  .textarea-form{
    width:64.5%;
  }
  .textareap{
    width:100%;
  }
  .care-btn{
    display:flex;
    margin-top:1rem;
    width:31%;
    border:1px solid  #d9e2ec;
    border-radius:5px 10px 10px 5px;
    justify-content:space-between;
  }
  
  .plantcare-btn{
    width:135px;
    height:56px;
    margin-top:auto;
  }
  .care-btn-img{
    height: '55px'
  }
  li{
    display:flex;
    flex-direction:row;
    margin-bottom:0.5rem;
    p{
        min-width:90px;
    }
  }
  .dlt-btn{
    display:flex;
    justify-content:center;
    align-items:center;
    border:none;
    padding:0.25rem;
    border-radius:5px;
    cursor:pointer;
    color:#D71313;
    margin:0;
    svg{
        padding:0 !important;
        margin:0 !important;
    }
  }
  .dlt-btn:hover{
    background:#D71313;
    color:#fff;
  }
  .plantcare-show{
    display:flex;
    justify-content:space-between;
    margin-top:1rem;
    margin-bottom:1.75rem;

    textarea{
        border-radius:5px;
        border:1px solid #d9e2ec
    }
  }
  .plantcare-show-list{
    min-width:31%;
  }
  .upload-button{
    border-radius:5px;
    font-size:16px;
    font-weight:500;
    background:#228f47;
    cursor: pointer;
    text-transform:uppercase;
    height:50px;
  }
  .message{
    margin-top:1rem;
    background:#CCFFCC;
    display:inline-block;
    padding:0.5rem 1rem;
  }
  .message-first{
    margin-bottom:1rem;
    background:#CCFFCC;
    display:inline-block;
    padding:0.5rem 1rem;
  }
  .selected-plantcare{
    display:flex;
    flex-direction:row;
  }
 `