import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import GeoLocationTest from "./components/GeolocationTest";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeoLocationCapture from "./components/GeoLocationCapture";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/geo" element={<GeoLocationTest />} />
        <Route path="/capture-geo" element={<GeoLocationCapture />} />
      </Routes>
    </Router>
    <ToastContainer />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
