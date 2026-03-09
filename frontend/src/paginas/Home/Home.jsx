import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../../componentes/Seo/Seo";

import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import imgJumbo from "../../assets/imagenes_jumbotron/JumboHome.png";
import { CuentaAtras } from "../../componentes/CuentaAtras/CuentaAtras"
import { SliderHome } from "../../componentes/Slider/SliderHome";
import { Videos } from "../../componentes/Videos/Videos";
import { AgendaConciertos } from "../../componentes/AgendaConciertos/AgendaConciertos";
import styles from "./home.module.css";
import { Context } from "../../store/AppContext";
import adelantogarra from "../../assets/Garra/01_adelanto_garra.mp4";

export const Home = () => {
    const { actions } = useContext(Context);
    const [iframeLoaded, setIframeLoaded] = useState(true);
    const location = useLocation();

    return (
        <>
            <Seo
                title="Home | Sienna Fans"
                description="Bienvenidx a la página de fans de Sienna."
            />

            <div className="bg-black">
                <Jumbotron
                    imagenFondo={{
                        backgroundImage: `url(${imgJumbo})`,
                        backgroundPosition: "center 10%",
                    }}
                    subtitulo={"Ya no se me para el tiempo"}
                    referencia={"home"}
                />

                {/* AQUÍ EMPIEZA EL FONDO DIFERENCIADO */}
                <div className={styles.fondoContenido}>
                    <div className="container pt-5">
                        <CuentaAtras />
                    </div>

                    <div className="d-flex justify-content-center mt-5">
                        <video
                            src={adelantogarra}
                            controls
                            loop
                            muted
                            autoPlay
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                borderRadius: '12px',
                                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                            }}
                        />
                    </div>

                    {/* Aquí puedes seguir añadiendo los demás componentes 
                        como SliderHome, Videos, etc. */}
                </div>
            </div>
        </>
    );
};
