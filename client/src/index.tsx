
// Author: Seth Franklin (GitHub ID: SethFranklin)

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"

import Login from "./Login";
import Seats from "./Seats";
import Card from "./Card";
import Order from "./Order";
import DoesntExist from "./DoesntExist";

const App = function() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="seats" element={<Seats />} />
        <Route path="card" element={<Card />} />
        <Route path="order" element={<Order />} />
        <Route path="*" element={<DoesntExist />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById("root")
)