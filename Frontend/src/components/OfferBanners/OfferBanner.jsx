import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import axios from 'axios';
import { Login } from '@mui/icons-material';

const OfferBanner = () => {
    const options = [
        { value: 'banner1', label: 'Banner First' },
        { value: 'banner2', label: 'Banner Second' },
        { value: 'banner3', label: 'Banner Third' },
        { value: 'banner4', label: 'Banner Fourth' },
      ];

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFiles2, setSelectedFiles2] = useState([]);
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const [banners,setBanners] = useState([])
    const [banners2,setBanners2] = useState([])

    const [refresh,setRefresh] =useState(false)
    const [msg,setMsg] = useState('')
    const [links,setLinks] =useState('')
    const [isPost ,setIsPost] =useState(false)


    const getLabelForValue = (value) => {
      const selectedOption = options.find(option => option.value === value);
      return selectedOption ? selectedOption.label : '';
  };


    const handleSelectChange = (value) => {
        setSelectedOption(value);
      };
    

      const onDrop = (acceptedFiles, dropzoneIdentifier) => {
        if (dropzoneIdentifier === 'dropzone1') {
            setSelectedFiles([acceptedFiles[0]]);
        } else if (dropzoneIdentifier === 'dropzone2') {
            setSelectedFiles2([acceptedFiles[0]]);
        }
    };
    const handleFileInputChange = (e) => {
        // Handle file input change (browsing method)
        // const newFiles = Array.from(e.target.files);
        // setSelectedFiles([...selectedFiles, ...newFiles]);
        const newFile = e.target.files[0];
        setSelectedFiles([newFile]);
    };
    const handleFileInputChange2 = (e) => {
      // Handle file input change (browsing method)
      // const newFiles = Array.from(e.target.files);
      // setSelectedFiles([...selectedFiles, ...newFiles]);
      const newFile = e.target.files[0];
      setSelectedFiles2([newFile]);
  };
    const removeFile = (file) => {
        // Remove a file from the selectedFiles array
        const updatedFiles = selectedFiles.filter((f) => f !== file);
        setSelectedFiles(updatedFiles);
    };
    const removeFile2 = (file) => {
      // Remove a file from the selectedFiles array
      const updatedFiles = selectedFiles2.filter((f) => f !== file);
      setSelectedFiles2(updatedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'dropzone1'),
    accept: 'image/*',
});

const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'dropzone2'),
    accept: 'image/*',
});
 
const uploadBanners = async () => {
  try {
      const formData = new FormData();

      // If 'Banner First' is selected, append files and navigate information from both forms
      if (getLabelForValue(selectedOption) === 'Banner First') {
          selectedFiles.forEach((file) => {
              formData.append('photos', file);
              formData.append('navigate', links);
          });

          selectedFiles2.forEach((file) => {
              formData.append('photos', file);
              formData.append('navigate', links);
          });
      } else {
          // If not 'Banner First', append files and navigate information from the first form only
          selectedFiles.forEach((file) => {
              formData.append('photos', file);
              formData.append('navigate', links);
          });
      }

      await axios.post(`${process.env.REACT_APP_BASE_URL}/addBanner`, formData, {
          params: {
              typeName: selectedOption,
          },
      });

      setMsg('Image Added');
      setSelectedFiles([]);
      setSelectedFiles2([]);
      setLinks('');
      getAllBanners()
      setIsPost(true);
      setRefresh(true);
  } catch (error) {
      // Handle error
      console.error(error);
  }
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

const getAllBanners = async()=>{
    try {
        const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/getBanners`)
      
        setBanners(resp.data)
    } catch (error) {
        // console.log(error);
    }
}

const [updateLink,setUpdateLink]= useState('')
const [isUpdated ,setIsUpdated] = useState(false)

const updatNavigateLink = async (id) => {
  let values = Object.values(updateLink);

  try {
    const resp = await axios.put(`${process.env.REACT_APP_BASE_URL}/updateBanner/${id}`, { navigate: values[0] });
    setIsUpdated(true)
    setRefresh(true)
    setMsg('Url Updated....')
    setBanners(resp.data);
  } catch (error) {

  }
}

useEffect(()=>{
  getAllBanners();
},[isUpdated])
const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

const handleCheckboxChange = (id) => {
    setSelectedCheckboxes((prevSelected) => {
        if (prevSelected.includes(id)) {
            return prevSelected.filter((selectedId) => selectedId !== id);
        } else {
            return [...prevSelected, id];
        }
    });
};

const handleImageClick = (index) => {
    handleCheckboxChange(index);
};

const [isDelete,setIsDelete] =useState(false);

const handleDeleteSelected = async () => {
    // console.log(selectedCheckboxes);
    try {
        const resp = await axios.delete(`${process.env.REACT_APP_BASE_URL}/banner/delete`, {
            data: { bannerIds: selectedCheckboxes },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setMsg('Image Removed...')
        getAllBanners()
        setRefresh(true)
        setIsDelete(true)
        return resp;
    } catch (error) {
        // console.error(error);
    }
  
};



const [editBanners,setEditBanners]= useState([]);

useEffect(() => {
    getAllBanners();
}, [refresh]);

useEffect(() => {
  if (Array.isArray(banners) && banners.length > 0) {
      const filteredBanners = banners.filter((b) => b.typeName === selectedOption);
      setEditBanners(filteredBanners);
  }
}, [banners, selectedOption]);

useEffect(() => {
    if (msg) {
      const timeoutId = setTimeout(() => {
        setMsg('');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [msg]);

  return (
    <>
     <div className='single'>
        <Sidebar />
        <div className='singleContainer'>
        <Navbar />
        <MainWrapper>
        <Wrapper>
        <div className='add-div'>
        <h3>Banners</h3>
        <div className='select-opt'>
        <Select options={options} className="sort-input"  styles={customStyles} isSearchable={false}
        defaultValue={options[0]}  onChange={(selectedOption) => handleSelectChange(selectedOption.value)} />
        </div>
        <div className='header'>
        <h4>Add New {selectedOption? getLabelForValue(selectedOption) :options[0].label}</h4>
        {msg && <p className='warning'>{msg}</p>}
        </div>
        {(getLabelForValue(selectedOption)==='Banner First') && <h5  className='banner1'>Banner for computer</h5>}
        <Grid container spacing={2} className="image-grid" sx={{ overflowX: 'auto' }}>
                                        {selectedFiles.map((file, index) => (
                                            <Grid item key={index} xs={3}>
                                                <div className="image-container">
                                                    {file && (
                                                        <React.Fragment>
                                                            <img
                                                                src={file ? URL.createObjectURL(file) : ''}
                                                                alt={file ? file.name : ''}
                                                                className="uploaded-image"
                                                                style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                onClick={() => removeFile(file)}
                                                                className="delete-icon"
                                                            />
                                                        </React.Fragment>
                                                    )}
                                                </div>
                                            </Grid>
                                        ))}

                                        <div className="formThird">
                                            <div {...getRootProps()} className="dropzone" style={{ border: '.2px solid black', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <input {...getInputProps()} />
                                                <FontAwesomeIcon icon={faUpload} size="2x" />
                                            </div>
                                            <input
                                                type="file"
                                                multiple={false}
                                                onChange={handleFileInputChange}
                                                style={{ display: 'none' }}
                                                id="fileInput"
                                            />
                                        </div>
                                    </Grid>
                                    {(getLabelForValue(selectedOption)==='Banner First') &&
                                    <>
                                    <h5 className='banner1'>Banner for Mobile</h5>
                                     <Grid container spacing={2} className="image-grid" sx={{ overflowX: 'auto' }}>
                                        {selectedFiles2.map((file, index) => (
                                            <Grid item key={index} xs={3}>
                                                <div className="image-container">
                                                    {file && (
                                                        <React.Fragment>
                                                            <img
                                                                src={file ? URL.createObjectURL(file) : ''}
                                                                alt={file ? file.name : ''}
                                                                className="uploaded-image"
                                                                style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                onClick={() => removeFile2(file)}
                                                                className="delete-icon"
                                                            />
                                                        </React.Fragment>
                                                    )}
                                                </div>
                                            </Grid>
                                        ))}

                                        <div className="formThird">
                                            <div {...getRootProps2()} className="dropzone" style={{ border: '.2px solid black', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <input {...getInputProps2()} />
                                                <FontAwesomeIcon icon={faUpload} size="2x" />
                                            </div>
                                            <input
                                                type="file"
                                                multiple={false}
                                                onChange={handleFileInputChange2}
                                                style={{ display: 'none' }}
                                                id="fileInput"
                                            />
                                        </div>
                                    </Grid></>}
                                    
                                    <TextField
                                    required
                                    id="outlined-required"
                                    label="Add Link"
                                    value={links}
                                    onChange={(e) => setLinks(e.target.value)}
                                    Small
                                    InputLabelProps={{
                                      style: {
                                        lineHeight: '0.75',
                                    
                                      },
                                    }}
                                    InputProps={{
                                        style: {
                                            maxWidth: '550px',
                                            minWidth:'350px',
                                            borderColor: 'blue',
                                            backgroundColor: 'white' ,
                                            height:'40px',
                                            padding:'0px',
                                        },
                                    }}
                                /><br/>
                                    <button className='btn' type='submit' onClick={uploadBanners}>submit</button>
        </div>
        <div className='edit-div'>
        <h4>Edit {selectedOption? getLabelForValue(selectedOption) :options[0].label}</h4>
       <div className='img-div-main'>
       {editBanners && editBanners.map((imgs,idx)=>{
        return(
        <div className='img-div'>
            <img src={imgs.photos[0].url} alt="banner" className='banner-edit' onClick={() =>  handleImageClick(imgs._id)}/>
            {imgs?.navigate && <div className='update-div'>
              <TextField id="outlined-required" value={updateLink[imgs._id] !== undefined ? updateLink[imgs._id] : imgs.navigate} onChange={(e) => setUpdateLink({...updateLink, [imgs._id]: e.target.value})}
                            Small InputLabelProps={{ style: { lineHeight: '0.75'},
                            }}
                            InputProps={{
                                style: {
                                    maxWidth: '550px',
                                    minWidth:'365px',
                                    borderColor: 'blue',
                                    backgroundColor: 'white' ,
                                    height:'40px',
                                    padding:'0px',
                                    fontSize:'13px',
                                    borderRadius:'5px 0px 0px 5px'
                                },
                            }}
                        />

              
              <button className='btn' onClick={() => updatNavigateLink(imgs._id)}>update</button></div>}
            <input type="checkbox" onChange={() => handleCheckboxChange(imgs._id)} checked={selectedCheckboxes.includes(imgs._id)} />
         </div>
              )
          })}
       </div>
       <button className='delete-btn' onClick={handleDeleteSelected}> <FontAwesomeIcon  icon={faTrash} /></button>
        </div>
       </Wrapper>
       </MainWrapper>
     </div>
     </div>
    </>
    
  )
}


export default OfferBanner

const MainWrapper = styled.div`
background:#F5F7F8;
min-height:80vh;
margin:0;
padding-top:2rem;
padding-bottom:0.5rem;
`

const Wrapper = styled.div`
width:95%;
margin:0 auto;
background:#fff;
min-height:80vh;
padding-left:0.75rem;
border-radius:5px;
display:flex;
justify-content:space-between;
.add-div{
    flex:1.25;
    height:100%;
    min-height:80vh;
    border-right:2px solid #d9e2ec;
}

.edit-div{
    flex:.85;
    padding-left:1rem;
}
.update-div{
  display:flex;
  flex-direction:row;
  margin:0.5rem 0;
  input{
    border-radius:0px 5px 5px 0px;
  }
  button{
    margin-top:0;
    border-radius:0px 5px 5px 0px;
  }
}
.header{
  display:flex;
  flex-direction:row;
  gap:5rem;
}
flex-direction:row;
  .select-opt{
    width:300px;
    margin-bottom:1rem;
  }
  h3,h4{
    margin-bottom:1rem;
    padding-left:0;
    margin-left:0;
  }
  .image-grid{
    width:100%;
    height:100%;
    margin-bottom:2rem;
  }
  .MuiGrid-item {
    margin-bottom:3rem;
  }
  .img-div{
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    gap:0.5rem;
    align-items:flex-start;
  }
  .img-div-main{
    display:flex;
    flex-direction:column;
    gap:2rem;
    max-height:70vh;
    overflow-y:auto;
  }
  .banner-edit{
    width:440px;

  }
  .warning{
    margin-bottom:1rem;
    background:#CCFFCC;
    display:inline-block;
    height:20px;
    margin-top:auto;
    padding:0.25rem 1rem;
}
  .btn{
    margin-top:2rem;
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
  .btn:hover{
    box-shadow:  0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .delete-btn{
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
  .banner1{
    display:inline-block;
    margin:0;
    padding:0.5rem .45rem;
    background:#befad3;
    border-radius:5px;
  }
`
