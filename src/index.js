import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";

//rendering the state values from startRating making it state component, rather than just presentational Component

function Test() {
  const [moiveRating, setMoiveRating] = useState(0);

  return (
    <div>
      <StarRating maxRating={3} color="blue" onSetRating={setMoiveRating} />
      <p>This moive has Rated {moiveRating} Stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10} />
    <StarRating
      size={25}
      color="purple"
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      defaultRating={3}
    />
    <Test /> */}
  </React.StrictMode>
);
