import React, { useState } from "react";
import "./PlusMenu.css"; // Import CSS file
import toast from "react-hot-toast";
import axios from "axios";
import AIhelp from "./AIhelp";
const PlusMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [city, setcity] = useState("");
  const [weatherinfo, setwhetherinfo] = useState({});
  const [isshowweather, setisshowweather] = useState(false);
  const [isaihelp, setaihelp] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [isweather, setiswhether] = useState(false);

  const getweather = async () => {
    const options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
      params: {
        q: city,
        days: "3",
      },
      headers: {
        "x-rapidapi-key": "86bd841dbfmsheb65cfbd893a32dp1cef31jsn52d4e5f6440f",
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      
      setwhetherinfo(response.data);
      setiswhether(false);
      setisshowweather(true);
      return;
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error("cannot get weather");
        console.error("Error response:", error.response.data);
      } else {
        toast.error("cannot get weather");
        console.error("Error:", error.message);
      }
    }
  };
  const reset = () => {
    toggleMenu();
    setcity("");
    setisshowweather(false);
    setiswhether(false);
    setaihelp(false);
    setwhetherinfo({});
  };
  return (
    <div className="plus-menu-container">
      {/* Menu Options */}
      {isMenuOpen && (
        <div className="menu-options">
          <button className="menu-button">Live Cricket Score</button>
          <button
            className="menu-button"
            onClick={() => {
              toggleMenu();
              setiswhether(true);
            }}
          >
            Weather Forecast
          </button>
          <button className="menu-button">Stock Update</button>
          <button
            className="menu-button"
            onClick={() => {
              toggleMenu();
              setaihelp(true);
            }}
          >
            AI Help
          </button>
        </div>
      )}
      {isweather && (
        <div className="temp-show">
          <input
            type="text"
            placeholder="Enter City Name..."
            className="border border-blue-300 a p-4 m-4"
            value={city}
            onChange={(e) => setcity(e.target.value)}
          />
          <button onClick={getweather}>Get Temprature</button>
          <button onClick={reset}>Reset</button>
        </div>
      )}
      {isshowweather && (
        <div className="temp-show">
          <div>{`For ${weatherinfo.location.name},${weatherinfo.location.region},${weatherinfo.location.country}`}</div>
          <div>{`Date: ${weatherinfo.location.localtime.substring(
            0,
            10
          )}`}</div>
          <div>{`Time: ${weatherinfo.location.localtime.substring(
            11,
            16
          )}`}</div>

          <span className="flex flex-row">
            <img
              src={`${weatherinfo.current.condition.icon}`}
              alt="Icon"
              className="h-1/8"
            />
            <div>{`Outside Condition: ${weatherinfo.current.condition.text}`}</div>
          </span>
          <div>{`Temperature: ${weatherinfo.current.temp_c}`}&deg;C</div>
          <div>{`Feels Like: ${weatherinfo.current.feelslike_c}`}&deg;C</div>
          <div>
            {`Max.Temperature: ${weatherinfo.forecast.forecastday[0].day.maxtemp_c}`}
            &deg;C
          </div>
          <div>
            {`Min.Temperature: ${weatherinfo.forecast.forecastday[0].day.mintemp_c}`}
            &deg;C
          </div>

          <div>
            {`Wind Speeds: ${weatherinfo.current.wind_kph}km/h ${weatherinfo.current.wind_dir}`}{" "}
          </div>
          <div>{`Visibility: ${weatherinfo.current.vis_km}km `} </div>
          <div>{`Humidity: ${weatherinfo.current.humidity}% `} </div>
          <div>{`Sunrise: ${weatherinfo.forecast.forecastday[0].astro.sunrise}`}</div>
          <div>{`Sunset: ${weatherinfo.forecast.forecastday[0].astro.sunset}`}</div>

          <button onClick={reset}>Reset</button>
        </div>
      )}
      {isaihelp && (
        <div>
          <AIhelp />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <button onClick={reset}>Reset</button>
          </div>
        </div>
      )}

      {/* Plus Button */}
      <button className="plus-button" onClick={toggleMenu}>
        <span className="plus-icon">+</span>
      </button>
    </div>
  );
};

export default PlusMenu;
