import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./componentes/Navbar/Navbar.jsx";
import { Home } from "./paginas/Home/Home.jsx";
import { Registro } from "./paginas/Registro/Registro.jsx";
import { RegistroCompleto } from "./componentes/FormRegistro/RegistroCompleto.jsx";
import { QuienEsSienna } from "./paginas/QuienEsSienna/QuienEsSienna.jsx";
import { ObjetivosCF } from "./paginas/ObjetivosCF/ObjetivosCF.jsx";
import { Admin } from "./paginas/Admin/Admin.jsx";
import { Agenda } from "./paginas/Admin/Agenda.jsx";
import { InicioSesion } from "./paginas/InicioSesion/InicioSesion.jsx";
import { Footer } from "./componentes/Footer/Footer.jsx";
import { GestionUsuarios } from "./paginas/Admin/GestionUsuarios.jsx";
import { GestionGalerias } from "./paginas/Admin/GestionGalerias.jsx";
import { Fotos } from "./paginas/Multimedia/Fotos.jsx";
import { GestionEntrevistas } from "./paginas/Admin/GestionEntrevistas.jsx";
import { Entrevistas } from "./paginas/Multimedia/Entrevistas.jsx";
import { GestionSorteos } from "./paginas/Admin/GestionSorteos.jsx";
import { Sorteos } from "./paginas/Sorteos/Sorteos.jsx";
import { Entrada } from "./paginas/Entrada/Entrada.jsx";
import { Links } from "./paginas/Links/Links.jsx";
import { Contacto } from "./paginas/Contacto/Contacto.jsx";
import usePageTracking from "./usePageTracking.js";
import { Analytics } from "@vercel/analytics";

function AppContent() {
  usePageTracking();
  const location = useLocation();
  const hideLayout = location.pathname === "/inicioSesion";

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="App-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/completar-registro" element={<RegistroCompleto />} />
          <Route path="/inicioSesion" element={<InicioSesion />} />
          <Route path="/quienessienna" element={<QuienEsSienna />} />
          <Route path="/objetivoscf" element={<ObjetivosCF />} />
          <Route path="/links" element={<Links />} />
          <Route path="/contacto" element={<Contacto />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/agenda" element={<Agenda />} />
          <Route path="/admin/gestionusuarios" element={<GestionUsuarios />} />
          <Route path="/admin/gestiongalerias" element={<GestionGalerias />} />
          <Route path="/admin/gestionentrevistas" element={<GestionEntrevistas />} />
          <Route path="/admin/gestionsorteos" element={<GestionSorteos />} />

          <Route
            path="*"
            element={
              <h1
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                  margin: 0,
                }}
              >
                Página no encontrada
              </h1>
            }
          />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const splashShown = localStorage.getItem("splashShown");
    if (!splashShown) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem("splashShown", JSON.stringify(true));
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <BrowserRouter>
      {showSplash ? <Entrada /> : <AppContent />}
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
