import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from "./componentes/Navbar/Navbar.jsx";
import { Home } from "./paginas/Home/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="App-content">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
