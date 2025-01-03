import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

 function Signup() {
  const BASEURL=import.meta.env.VITE_BACKEND_URL
console.log(BASEURL)
  const [issubmitting, setissubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onsubmit = async (data) => {
    setissubmitting(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("fullname", data.fullname);
    formData.append("password", data.password);
    formData.append("username", data.username);
    formData.append("avatar", data.avatar[0]);
    if (data.coverImage && data.coverImage[0]) {
      formData.append("coverimage", data.coverImage[0]);
    }
   
    try {
      const response = await axios.post(`/api/v1/users/registernewuser`,formData);
      
      toast.success(response.data.message);
      setTimeout(() => navigate("/login"), 500);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Sign up failed");
        console.error("Error response:", error.response.data);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    } finally {
      setissubmitting(false);
    }
  };
  useEffect(()=>{
    console.log(BASEURL)
  })
  return (
    <div className="form-container">
      <h2>Sign Up</h2>
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

        <div className="form-group">
          <label>Fullname</label>
          <input
            type="text"
            {...register("fullname", { required: "fullname is required" })}
          />
        </div>

        <div className="form-group">
          <label>Avatar</label>
          <input
            type="file"
            accept="image/*"
            {...register("avatar", { required: "Avatar is required" })}
          />
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <input type="file" accept="image/*" {...register("coverImage")} />
        </div>

        <button type="submit" className="submit-button" disabled={issubmitting}>
          {issubmitting ? "Registering" : "Signup"}
        </button>
      </form>
      <div
        style={{
          fontSize: "smaller",
          marginTop: "1rem",
          width: "100%",
          display: "flex",
          flexDirection: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Already have account...{" "}
        <a style={{ textDecoration: "underline" }} href="/login">
          {" "}
          login
        </a>
      </div>
    </div>
  );

}
export default Signup