import React from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends React.Component {
  state = {
    lat: 30.1575, // Default latitude for Multan
    lon: 71.5249, // Default longitude for Multan
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    main: undefined,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch(() => {
          this.getWeather(this.state.lat, this.state.lon); // Multan as default location
          alert(
            "You have disabled location services. Default location (Multan) weather will be shown."
          );
        });
    } else {
      alert("Geolocation not available. Showing default location (Multan) weather.");
      this.getWeather(this.state.lat, this.state.lon);
    }

    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000 // 10 minutes
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  getWeather = async (lat, lon) => {
    try {
      const api_call = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );

      if (!api_call.ok) {
        throw new Error(`HTTP error! status: ${api_call.status}`);
      }

      const data = await api_call.json();

      if (data && data.main && data.weather) {
        this.setState({
          lat: lat,
          lon: lon,
          city: data.name,
          temperatureC: Math.round(data.main.temp),
          temperatureF: Math.round(data.main.temp * 1.8 + 32),
          humidity: data.main.humidity,
          main: data.weather[0].main,
          country: data.sys.country,
        });
        this.setWeatherIcon(data.weather[0].main);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data. Please try again later.");
    }
  };

  setWeatherIcon = (mainWeather) => {
    const weatherIcons = {
      Haze: "CLEAR_DAY",
      Clouds: "CLOUDY",
      Rain: "RAIN",
      Snow: "SNOW",
      Dust: "WIND",
      Drizzle: "SLEET",
      Fog: "FOG",
      Smoke: "FOG",
      Tornado: "WIND",
      default: "CLEAR_DAY",
    };

    this.setState({
      icon: weatherIcons[mainWeather] || weatherIcons["default"],
    });
  };

  render() {
    const { temperatureC, city, country, main, icon } = this.state;

    if (temperatureC !== undefined) {
      return (
        <React.Fragment>
          <div className="city">
            <div className="title">
              <h2>{city}</h2>
              <h3>{country}</h3>
            </div>
            <div className="mb-icon">
              <ReactAnimatedWeather
                icon={icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{main}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {temperatureC}°<span>C</span>
                </p>
              </div>
            </div>
          </div>
          <Forcast icon={icon} weather={main} />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <img
            src={loader}
            alt="Loading..."
            style={{ width: "50%", WebkitUserDrag: "none" }}
          />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location will be displayed and used for real-time
            weather calculation.
          </h3>
        </React.Fragment>
      );
    }
  }
}

export default Weather;
