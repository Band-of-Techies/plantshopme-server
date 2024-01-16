import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getTitle } from "./checkurl";

import { Link } from "react-router-dom";

import {
 
  ExitToApp as ExitToAppIcon,

  ExitToApp  as SignInIcon,
  PersonAdd as SignUpIconFilled,
  
} from "@mui/icons-material";

const Navbar = () => {
  const location = useLocation();
  const [title, setTitle] = useState(''); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    const newTitle = getTitle(path); 
    setTitle(newTitle); 
  }, [location.pathname]);
  return (
    <div className="navbar">
      <div className="wrapper">
        <div>
        <p className="heading">{title}</p> 
        </div>
        {/* <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div> */}
        <div className="items">
          <div className="item red"  >
          <Link to="/login" onClick={handleLogout}>
              <ExitToAppIcon className="icon" style={{ fontSize: "14px"}} />
              <span>Logout</span>
          </Link>
          </div>
          <div className="item blue"  >
          <Link to="/signup">
              <SignUpIconFilled className="icon" style={{ fontSize: "14px" }} />
              <span>Signup</span>
          </Link>
          </div>
          {/* <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div> */}
          {/* <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <img
              src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="avatar"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
