import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from "./componentes/Navbar/Navbar.jsx";
import { Home } from "./paginas/Home/Home.jsx";
import { Registro } from "./paginas/Registro/Registro.jsx";
import { RegistroCompleto } from "./componentes/FormRegistro/RegistroCompleto.jsx";
import { QuienEsSienna } from "./paginas/QuienEsSienna/QuienEsSienna.jsx";
import { ObjetivosCF } from "./paginas/ObjetivosCF/ObjetivosCF.jsx";
import { Admin } from "./paginas/Admin/Admin.jsx";
import { Agenda } from "./paginas/Admin/Agenda.jsx";
import { InicioSesion } from "./paginas/InicioSesion/InicioSesion.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="App-content">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/completar-registro" element={<RegistroCompleto />} />
            <Route path="/inicioSesion" element={<InicioSesion />} />
            <Route path="/quienessienna" element={<QuienEsSienna />} />
            <Route path="/objetivoscf" element={<ObjetivosCF />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/agenda" element={<Agenda />} />




          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
