import React, { useState } from "react";
import Weather from "./Components/Weather";

function App() {
  const [city, setCity] = useState("Toronto");

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Weather App</h1>
      <input
        type="text"
        placeholder="Enter City"
        value={city}
        onChange={handleCityChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      />
      <Weather city={city} />
    </div>
  );
}

export default App;
