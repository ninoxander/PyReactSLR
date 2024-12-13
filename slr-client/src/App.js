import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Regression from "./components/Regression";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Regression />} />
      </Routes>
    </Router>
  );
}

export default App;
