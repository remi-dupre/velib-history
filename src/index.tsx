import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import StationView from "./components/StationView";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/station/:id" element={<StationView />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
