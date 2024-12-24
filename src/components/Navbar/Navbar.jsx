import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Profile from "../ownprofile/profile.jsx";
import logo from "./logo.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { togglevalue } from "../../slices/toggleSlice.jsx";
import { Howl } from "howler";
import Sidebar from "./sidebar.jsx";
import FormOverlay from "./settingsoption.jsx";
import { toggleauthentication } from "../../slices/authenticationSlice.jsx";
import { Badge } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { setUser, socket } from "../../utils/socket.js";

const Navbar = () => {
  const [issubmitting, setissubmitting] = useState(false);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const mode = useSelector((state) => state.toggle.value);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [isauthenticated, setisauthenticated] = useState(false);
  const [searchquery, setsearchquery] = useState(query ? query : "");
  const [isClicked, setisClicked] = useState(false);
  const dispatch = useDispatch();
  const [senduserid, setsenduserid] = useState(false);
  const user = useSelector((state) => state.user.value);
  const [render, setrender] = useState(false);
  const [isnotificationavail, setisnotificationavail] = useState(false);
  const [useravatar,setuseravatar]=useState('')
  const notificationSound = new Howl({
    src: ["./notification-sound.mp3"],
  });
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectOption = (action) => {
    setSelectedAction(action);
    setIsSidebarOpen(false);
  };

  const handleCloseForm = () => {
    setSelectedAction(null);
  };

  const handleSubmitForm = async (action, data) => {
    try {
      setissubmitting(true);
      if (action === "Change Password") {
        const res = await axios.post("/api/v1/users/changepassword", data);
        toast.success(res.data.message);
      } else if (action === "Change Name") {
        const res = await axios.patch("/api/v1/users/update-account", {
          fullname: data.fullname,
          email: data.email,
        });
        toast.success(res.data.message);
      } else if (action === "Change Avatar") {
        const formData = new FormData();
        formData.append("avatar", data.avatar[0]);
        const res = await axios.patch("/api/v1/users/update-avatar", formData);
        toast.success(res.data.message);
      } else if (action === "Change Cover Image") {
        const formData = new FormData();
        formData.append("coverimage", data.coverimage[0]);
        const res = await axios.patch(
          "/api/v1/users/update-coverimage",
          formData
        );
        toast.success(res.data.message);
      } else if (action === "Profile") {
        const username = data.Username;
        navigate(`/user/${username}`);
      }
      handleCloseForm();
    } catch (error) {
      const errorMsg = error.response?.data.message || "An error occurred";
      toast.error(errorMsg);
      console.error("Error:", errorMsg);
    } finally {
      setissubmitting(false);
    }
  };
  const handleNotificationClick = () => {
    setisnotificationavail(false);
    navigate("/notifications");
  };
  const getcurrent = async () => {
    try {
      const response = await axios.get("/api/v1/users/current-user");
  
      if (response.data.statuscode === 200) {
        dispatch(toggleauthentication(1));
        setisauthenticated(true);
        setuseravatar(response.data.data.avatar);
        setrender((prev) => !prev);
      } else {
        
        dispatch(toggleauthentication(0));
        setisauthenticated(false);
      }
    } catch (error) {
      
      if (error.response && error.response.status === 401) {
        dispatch(toggleauthentication(0));
        setisauthenticated(false);
      }
      
    }
  };
  useEffect(() => {
    getcurrent();
  }, [user]);
  useEffect(() => {
    const StoredCookies = Cookies.get("mode");
    if (StoredCookies === undefined) Cookies.set("mode", false, { expires: 7 });
  }, []);

  const [userid, setuserid] = useState(Cookies.get("userid") || "");
  useEffect(() => {
    if (isauthenticated || userid) {
      socket.connect();

      setUser(userid);
      socket.on("NotificationAvail", () => {
        setisnotificationavail(true);
        notificationSound.play();
      });
      return () => {
        socket.off("NotificationAvail");
      };
    }
  }, [render, isauthenticated, userid]);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to={"/"}>
          <img src={logo} alt="VideoShare" />
        </Link>
      </div>
      <div className="navbar__search">
        <input
          type="text"
          placeholder={
            mode ? "Search in Youtube..." : "Search in VideoShare..."
          }
          value={searchquery}
          onChange={(e) => setsearchquery(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.stopPropagation();
              navigate(`/search?query=${searchquery}`);
            }
          }}
        />
        {isauthenticated == true && (
          <button
            className="profile-button"
            onClick={() => handleSelectOption("Profile")}
          >
            <div className="profile-button-content">
              <AccountCircle className="profile-icon" />
              <span className="profile-text">
                Profile
                <br />
                Search
              </span>
            </div>
          </button>
        )}
      </div>

      <div className="navbar__auth">
        {isauthenticated == true ? (
          <>
            <button
              onClick={handleNotificationClick}
              className="notification-button"
            >
              <div style={{ position: "relative" }}>
                <NotificationsIcon style={{ fontSize: 28 }} />
                {isnotificationavail && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "red",
                    }}
                  ></div>
                )}
              </div>
            </button>

            <button onClick={toggleSidebar} className="notification-button" style={{outline:'none',minWidth:'3.39rem'}}>
              {isSidebarOpen ? "✕" : <SettingsIcon />}
            </button>
            <button onClick={()=>{navigate(`/user/dashboard`)}} style={{backgroundColor:'transparent',border:'0px',outline:'none'}} >
              <div style={{width:'2.3rem',height:'2.3rem',borderRadius:'50%'}}  className="manage-channel">
  
              <img src={useravatar} alt="" style={{width:'2.1rem',height:'2.1rem',borderRadius:'50%',margin:'0.1rem'}}/>
              </div>
            </button>

          </>
        ) : (
          <>
            <button className="auth-button"
              onClick={() => navigate("/signup")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              <PersonAdd style={{ fontSize: 24, color: "green" }} />
              <span>Sign Up</span>
            </button>
            <button className="auth-button"
              onClick={() => navigate("/login")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              <Login style={{ fontSize: 24, color: "blue" }} />
              <span>Log In</span>
            </button>
          </>
        )}
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onSelectOption={handleSelectOption}
      />
      {selectedAction && (
        <FormOverlay
          action={selectedAction}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          issubmit={issubmitting}
        />
      )}
    </nav>
  );
};

export default Navbar;
