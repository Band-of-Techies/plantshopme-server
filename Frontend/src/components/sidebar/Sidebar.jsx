import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { BiSolidOffer } from "react-icons/bi";
import { GiPlantSeed } from "react-icons/gi";
import { DiBitbucket } from "react-icons/di";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosPhotos } from "react-icons/io";
import { MdEditDocument } from "react-icons/md";
import { FaBloggerB } from "react-icons/fa";

import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  LocalFlorist as LocalFloristIcon,
  AddShoppingCart as AddShoppingCartIcon,
  LocalShipping as AddPotIcon,
  Storage as ProductStockIcon,
  Receipt as OrderDetailsIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Event as FlashSalesIcon,
  History as LogsIcon,
  PersonAdd as SignUpIconFilled,
  Flag as BannersIcon,
  Mail as NewsLetterIcon,
  ExitToApp as SignInIcon,

  AccountCircle as AccountCircleIcon,

} from "@mui/icons-material";
import logo from "../../assets/logo.png";
import { IconButton } from "@mui/material";

import "./sidebar.scss";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [userType, setUserType] = useState('');
  const [roles, setRoles] = useState([]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/CreateRoles/${LocalUserType}`);
      const data = await response.json();

      console.log('Fetched user details:', data);

      setUserType(data.userType);
      setRoles(data.roles || []);
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  useEffect(() => {
    // Fetch user details when the component mounts
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const LocalUserType = localStorage.getItem("UserType");
  console.log("LocalUserType:", LocalUserType);


  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={logo} alt="logo" className="logo" />
        </Link>
      </div>
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <Link to="/" style={{ textDecoration: "none" }}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>

          {roles.includes("Add Category") && (
            <React.Fragment key="Add Category">
              <p className="title">LISTS</p>
              <Link to="/addCategory" style={{ textDecoration: "none" }}>
                <li>
                  <CategoryIcon className="icon" />
                  <span>Add Category</span>
                </li>
              </Link>
            </React.Fragment>
          )}


          {/* <p className="title">LISTS</p>
          <Link to="/addCategory" style={{ textDecoration: "none" }}>
            <li>
              <CategoryIcon className="icon" />
              <span>Add Category</span>
            </li>
          </Link> */}
          {/* <Link to="/addplantcare" style={{ textDecoration: "none" }}>
            <li>
              <LocalFloristIcon className="icon" />
              <span>Plantcare</span>
            </li>
          </Link> */}


          {roles.includes("Plantcare") && (
            <React.Fragment key="Plantcare">
             
              <Link to="/addplantcare" style={{ textDecoration: "none" }}>
            <li>
              <LocalFloristIcon className="icon" />
              <span>Plantcare</span>
            </li>
          </Link>
            </React.Fragment>
          )}

          {/* <Link to="/otherproducts" style={{ textDecoration: "none" }}>
            <li>
              <AddShoppingCartIcon className="icon" />
              <span>Add Product</span>
            </li>
          </Link> */}

          {roles.includes("Add Product") && (
            <React.Fragment key="Add Product">
             
             <Link to="/otherproducts" style={{ textDecoration: "none" }}>
            <li>
              <AddShoppingCartIcon className="icon" />
              <span>Add Product</span>
            </li>
          </Link>
            </React.Fragment>
          )}


          {/* <Link to="/addPot" style={{ textDecoration: "none" }}>
            <li>
              <DiBitbucket className="icon" />
              <span>Pot</span>
            </li>
          </Link> */}

          {roles.includes("Pot") && (
            <React.Fragment key="Pot">
             
             <Link to="/addPot" style={{ textDecoration: "none" }}>
            <li>
              <DiBitbucket className="icon" />
              <span>Pot</span>
            </li>
          </Link>
            </React.Fragment>
          )}

          {/* <Link to="/all-products" style={{ textDecoration: "none" }}>
            <li>
              <GiPlantSeed className="icon" />
              <span>Products</span>
            </li>
          </Link> */}


          {roles.includes("Products") && (
            <React.Fragment key="Products">
             
             <Link to="/all-products" style={{ textDecoration: "none" }}>
            <li>
              <GiPlantSeed className="icon" />
              <span>Products</span>
            </li>
          </Link>
            </React.Fragment>
          )}


          {/* <Link to="/locations" style={{ textDecoration: "none" }}>
            <li>
              <FaLocationDot className="icon" />
              <span>Locations</span>
            </li>
          </Link> */}

          {roles.includes("Locations") && (
            <React.Fragment key="Locations">
             
             <Link to="/locations" style={{ textDecoration: "none" }}>
            <li>
              <FaLocationDot className="icon" />
              <span>Locations</span>
            </li>
          </Link>
            </React.Fragment>
          )}


          <p className="title">USEFUL</p>
          {/* <Link to="/productstock" style={{ textDecoration: "none" }}>
            <li>
              <ProductStockIcon className="icon" />
              <span>Product Stock</span>
            </li>
          </Link> */}


          {roles.includes("Product Stocks") && (
            <React.Fragment key="Product Stocks">
             
             <Link to="/productstock" style={{ textDecoration: "none" }}>
            <li>
              <ProductStockIcon className="icon" />
              <span>Product Stock</span>
            </li>
          </Link>
            </React.Fragment>
          )}


          {/* <Link to="/UpdateProductCategories" style={{ textDecoration: "none" }}>
            <li>
              <NotificationsIcon className="icon" />
              <span>Product Categories</span>
            </li>
          </Link> */}

          {roles.includes("Product Categories") && (
            <React.Fragment key="Product Categories">
             
             <Link to="/UpdateProductCategories" style={{ textDecoration: "none" }}>
            <li>
              <NotificationsIcon className="icon" />
              <span>Product Categories</span>
            </li>
          </Link>
            </React.Fragment>
          )}



          {/* <Link to="/orderdetails" style={{ textDecoration: "none" }}>
            <li>
              <OrderDetailsIcon className="icon" />
              <span>Order Details</span>
            </li>
          </Link> */}

          {roles.includes("Order Details") && (
            <React.Fragment key="Order Details">
             
             <Link to="/orderdetails" style={{ textDecoration: "none" }}>
            <li>
              <OrderDetailsIcon className="icon" />
              <span>Order Details</span>
            </li>
          </Link>
            </React.Fragment>
          )}

          <p className="title">SERVICE</p>
          {/* <Link to="/FlashSale" style={{ textDecoration: "none" }}>
            <li>
              <FlashSalesIcon className="icon" />
              <span>Flash Sales</span>
            </li>
          </Link> */}


          {roles.includes("Flash Sales") && (
            <React.Fragment key="Flash Sales">
             <Link to="/FlashSale" style={{ textDecoration: "none" }}>
            <li>
              <FlashSalesIcon className="icon" />
              <span>Flash Sales</span>
            </li>
          </Link>
            </React.Fragment>
          )}


          {/* <Link to="/Refundlist" style={{ textDecoration: "none" }}>
            <li>
              <IoIosPhotos className="icon" style={{ fontSize: "14px" }} />
              <span>Refund</span>
            </li>
          </Link> */}


          {roles.includes("Refund") && (
            <React.Fragment key="Refund">
            <Link to="/Refundlist" style={{ textDecoration: "none" }}>
            <li>
              <IoIosPhotos className="icon" style={{ fontSize: "14px" }} />
              <span>Refund</span>
            </li>
          </Link>
            </React.Fragment>
          )}


          {/* <Link to="/Addcoupons" style={{ textDecoration: "none" }}>
            <li>
              <BiSolidOffer className="icon" />
              <span>Coupons</span>
            </li>
          </Link> */}

          {roles.includes("Refund") && (
            <React.Fragment key="Refund">
           <Link to="/Addcoupons" style={{ textDecoration: "none" }}>
            <li>
              <BiSolidOffer className="icon" />
              <span>Coupons</span>
            </li>
          </Link>
            </React.Fragment>
          )}

          {/* <Link to="/addBlog" style={{ textDecoration: "none" }}>
            <li>
              <FaBloggerB className="icon" style={{ fontSize: "14px" }} />
              <span>Add Blog</span>
            </li>
          </Link> */}

          {roles.includes("Add Blogs") && (
            <React.Fragment key="Add Blogs">
          <Link to="/addBlog" style={{ textDecoration: "none" }}>
            <li>
              <FaBloggerB className="icon" style={{ fontSize: "14px" }} />
              <span>Add Blog</span>
            </li>
          </Link>
            </React.Fragment>
          )}


          {/* <Link to="/offerBanners" style={{ textDecoration: "none" }}>
            <li>
              <BannersIcon className="icon" style={{ fontSize: "14px" }} />
              <span>Banners</span>
            </li>
          </Link> */}

          {roles.includes("Banners") && (
            <React.Fragment key="Banners">
          <Link to="/offerBanners" style={{ textDecoration: "none" }}>
            <li>
              <BannersIcon className="icon" style={{ fontSize: "14px" }} />
              <span>Banners</span>
            </li>
          </Link>
            </React.Fragment>
          )}

          {/* <Link to="/FeatureLevel" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" style={{ fontSize: "14px" }} />
              <span>Feature Level</span>
            </li>
          </Link> */}

          {roles.includes("Feature Level") && (
            <React.Fragment key="Feature Level">
           <Link to="/FeatureLevel" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" style={{ fontSize: "14px" }} />
              <span>Feature Level</span>
            </li>
          </Link>
            </React.Fragment>
          )}

          {/* <Link to="/CouponManagement" style={{ textDecoration: "none" }}>
            <li>
              <SettingsIcon className="icon" style={{ fontSize: "14px" }} />
              <span>Customer Management</span>
            </li>
          </Link> */}


          {roles.includes("Customer Management") && (
            <React.Fragment key="Customer Management">
           <Link to="/CouponManagement" style={{ textDecoration: "none" }}>
            <li>
              <SettingsIcon className="icon" style={{ fontSize: "14px" }} />
              <span>Customer Management</span>
            </li>
          </Link>
            </React.Fragment>
          )}

          {/* <Link to="/newsletter" style={{ textDecoration: "none" }}>
            <li>
              <NewsLetterIcon className="icon" style={{ fontSize: "14px" }} />
              <span>News Letter</span>
            </li>
          </Link> */}

          {roles.includes("News Letter") && (
            <React.Fragment key="News Letter">
          <Link to="/newsletter" style={{ textDecoration: "none" }}>
            <li>
              <NewsLetterIcon className="icon" style={{ fontSize: "14px" }} />
              <span>News Letter</span>
            </li>
          </Link>
            </React.Fragment>
          )}
          {/* <Link to="/signup" style={{ textDecoration: "none" }}>
            <li>
              <SignUpIconFilled className="icon" style={{ fontSize: "14px" }} />
              <span>signup</span>
            </li>
          </Link>
          <p className="title">USER</p> */}
          {/* <li>
            <AccountCircleIcon className="icon" />
            <span>Profile</span>
          </li> */}
          {/* <Link to="/login" style={{ textDecoration: "none" }} onClick={handleLogout}>
            <li>
              <ExitToAppIcon className="icon" style={{ fontSize: "14px" }} />
              <span>Logout</span>
            </li>
          </Link> */}
        </ul>
      </div>
      {/* <div className="bottom">
        <div className="colorOption" onClick={() => dispatch({ type: "LIGHT" })}></div>
        <div className="colorOption" onClick={() => dispatch({ type: "DARK" })}></div>
      </div> */}
    </div>
  );
};

export default Sidebar;
