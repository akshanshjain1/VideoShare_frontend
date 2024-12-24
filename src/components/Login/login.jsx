import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./login.css";
import { uservalue } from "../../slices/userSlice";
import Cookies from 'js-cookie'

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const returnurl = searchParams.get("returnurl");
  const [islogging, setislogging] = useState(false);
  const [user, setuser] = useState({});
  const setcurrentuser = async () => {
    try {
      const res = await axios.get("/api/v1/users/current-user");
      
      setuser(res.data.data);
      dispatch(uservalue(res.data.data));
      Cookies.set("userid",res.data.data._id,{expires:3,secure:true,sameSite:'Strict'})
      
      navigate(returnurl ? returnurl : `/`);
    } catch (error) {
      toast.error("Login again");
    }
  };
  const onsubmit = async (data) => {
    const userdata = {
      email: data.email,
      password: data.password,
      username: data.username,
    };
    setislogging(true);
    try {
      const response = await axios.post("/api/v1/users/login", userdata);
      toast.success(response.data.message);
      setcurrentuser();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "login failed");
        console.error("Error response:", error.response.data);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    } finally {
      setislogging(false);
    }
  };
  return (
    <div className="form-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
          />
        </div>
        <button type="submit" className="submit-button">
          {islogging ? "Logging in" : "Login"}
        </button>
      </form>
      <div style={{ fontSize: "smaller", marginTop: "1rem", width: "100%" }}>
        Do not have account...{" "}
        <a style={{ textDecoration: "underline" }} href="/signup">
          Signup Now
        </a>
      </div>
    </div>
  );
}
export default Login;
