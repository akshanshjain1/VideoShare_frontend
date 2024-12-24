import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
export default function Logout() {
  const navigate = useNavigate();
  const [isloggingout, setisloggingout] = useState(false);
  const logoutfeature = async () => {
    setisloggingout(true);
    try {
      const response = await axios.post("/api/v1/users/logout");
      toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Signup failed");
        console.error("Error response:", error.response.data);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    } finally {
      setisloggingout(false);
      navigate("/");
    }
  };
  return (
    <div>
      <h1>Click here to logout </h1>
      <button
        className={"bg-blue-500 px-4 py-2 text-white"}
        onClick={logoutfeature}
      >
        {isloggingout ? "Logging out" : "Logout"}
      </button>
    </div>
  );
}
