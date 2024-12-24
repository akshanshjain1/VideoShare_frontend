import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { togglevalue } from "../../slices/toggleSlice";
import Cookies from "js-cookie";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const Sidebar = ({ isOpen, onClose, onSelectOption }) => {
  const mode = useSelector((state) => state.toggle.value);
  const [localmode, setlocalmode] = useState(mode);
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const toggle = async () => {
    const newmode = !localmode;
    setlocalmode(newmode);
    dispatch(togglevalue(newmode));
    Cookies.set("mode", newmode, { expires: 7 });
  };
  useEffect(() => {
    setlocalmode(mode);
  }, [mode]);
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <span className="slider1 ">YT Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              onChange={toggle}
              checked={localmode === true} // Reflect the mode state
            />
            <span className="slider"></span>
          </label>
        </li>

        <li onClick={() => onSelectOption("Change Password")}>
          Change Password
        </li>
        <li onClick={() => onSelectOption("Change Avatar")}>Change Avatar</li>
        <li onClick={() => onSelectOption("Change Cover Image")}>
          Change Cover Image
        </li>
        <li onClick={() => onSelectOption("Change Name")}>Change Name</li>
        <li onClick={() => {navigate("/logout")}}
          
            
            style={{
              display: "flex",
              alignItems: "start",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <Logout 
              style={{ fontSize: "1rem", color: "red", outline: "none" }}
            />
            <span>Logout</span>
          
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
