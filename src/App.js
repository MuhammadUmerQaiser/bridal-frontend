import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import CatalogListing from "./Pages/CatalogListing";
import CatalogDetails from "./Pages/CatalogDetails";
import Footer from "./components/Footer";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Appointment from "./Pages/Appointment";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog-listing" element={<CatalogListing />} />
            <Route path="/catalog-details" element={<CatalogDetails />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/appointments" element={<Appointment />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
