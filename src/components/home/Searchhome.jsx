import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HeroSectionSearch from "../HeroSection/Herosection.search.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import axios from "axios";
import "./home.css";
import { toggleauthentication } from "../../slices/authenticationSlice.jsx";
export default function SearchHome() {
  const dispatch = useDispatch();
  const getcurrent = async () => {
    try {
      const response = await axios("/api/v1/users/current-user");
      if (response.data.statuscode == 200) dispatch(toggleauthentication(1));
    } catch (error) {
      console.log("no user", error.response.data.message);
      dispatch(toggleauthentication(0));
    }
  };
  useEffect(() => {
    getcurrent();
  }, []);
  return (
    <>
      <div className="home">
        <Navbar />
        <HeroSectionSearch />
      </div>
    </>
  );
}
