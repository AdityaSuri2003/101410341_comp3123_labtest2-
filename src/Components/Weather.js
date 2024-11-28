import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Weather.css";

const Weather = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = "17a2888eb0a829d4db3c537cfd94e5ab"; 

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const weatherResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const forecastResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        setWeatherData(weatherResponse.data);

        const forecastGroupedByDay = groupForecastByDay(forecastResponse.data.list);
        setWeeklyForecast(forecastGroupedByDay);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData(null);
        setWeeklyForecast([]);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  const groupForecastByDay = (forecastList) => {
    
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    
    const forecastData = daysOfWeek.map((day) => {
      const forecastsForDay = forecastList.filter((item) =>
        new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "long" }) === day
      );

      if (forecastsForDay.length) {
        const middayForecast = forecastsForDay[Math.floor(forecastsForDay.length / 2)];
        return {
          day,
          temp: typeof middayForecast.main.temp === "number" ? middayForecast.main.temp : "N/A",
          description: middayForecast.weather[0].description || "No data",
          icon: middayForecast.weather[0].icon || "01d",
        };
      }

      
      return { day, temp: "N/A", description: "No data", icon: "01d" };
    });

    return forecastData;
  };

  if (loading) return <p>Loading...</p>;
  if (!weatherData) return <p>No data found. Try another city.</p>;

  const { main, weather, wind, name, sys } = weatherData;

  return (
    <div className="weather-app">
      <div className="main-container">
        {/* Current Weather */}
        <div className="current-weather">
          <div className="weather-card">
            <h2>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</h2>
            <p>{new Date().toLocaleDateString()}</p>
            <h1>
              {name}, {sys.country}
            </h1>
            <div className="temp">
              <h1>{main.temp.toFixed(1)}°C</h1>
              <img
                src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                alt="weather-icon"
              />
            </div>
            <p className="description">{weather[0].description.toUpperCase()}</p>
            <div className="details">
              <p>Humidity: {main.humidity}%</p>
              <p>Wind: {wind.speed} m/s</p>
              <p>Pressure: {main.pressure} hPa</p>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="forecast-row">
          {weeklyForecast.map((item, index) => (
            <div key={index} className="forecast-card">
              <p className="forecast-day">{item.day}</p>
              <div className="forecast-temp">
                <img
                  src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
                  alt="forecast-icon"
                />
                <p>{typeof item.temp === "number" ? `${item.temp.toFixed(1)}°C` : "N/A"}</p>
              </div>
              <p className="forecast-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
