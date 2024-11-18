import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import apiKeys from "./apiKeys"; // Ensure this file contains your API key and base URL
import ReactAnimatedWeather from "react-animated-weather";

function Forcast(props) {
  const [query, setQuery] = useState(""); // State to hold the city query
  const [error, setError] = useState(""); // State to hold any error messages
  const [weather, setWeather] = useState({}); // State to hold the weather data

  // Search function to fetch weather data based on the city
  const search = useCallback((city) => {
    if (!city) return; // Don't search if the city is empty

    axios
      .get(
        `${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setError(""); // Clear any previous errors
      })
      .catch((error) => {
        console.error(error);
        setWeather({}); // Clear previous weather data
        setError("City not found. Please try another city."); // Set error message
      });
  }, []);

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  // Call search with the default city when the component mounts
  useEffect(() => {
    search("Multan"); // Default city search
  }, [search]);

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)} // Update the query state
            value={query} // Bind the input value to query state
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              alt="Search"
              onClick={() => search(query)} // Call search with the query
              style={{ cursor: "pointer" }} // Add pointer to show it's clickable
            />
          </div>
          {/* Search icon instead of button */}
        </div>
        <ul>
          {typeof weather.main !== "undefined" ? (
            <div className="weather-details">
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather icon"
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°C ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">{Math.round(weather.main.humidity)}%</span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility / 1000)} km
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <div className="error-message">
              {error ? <p>{error}</p> : <p>Type in a city name and hit Search.</p>}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forcast;
