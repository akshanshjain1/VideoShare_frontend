import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HeroSection from "../HeroSection/HeroSection.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import axios from "axios";
import "./home.css";

export default function Home() {
  const dispatch = useDispatch();
//   const getcurrent = async () => {
//     try {
//       const response = await axios.get("/api/v1/users/current-user");
//       if (response.data.statuscode == 200) dispatch(toggleauthentication(1));
//     } catch (error) {
//       console.log("no user", error.response.data.message);
//       dispatch(toggleauthentication(0));
//     }
//   };
//   useEffect(() => {
//     getcurrent();
//   }, []);
  return (
    <>
      <div className="home">
        <Navbar />
        <HeroSection />
      </div>
    </>
  );
}
