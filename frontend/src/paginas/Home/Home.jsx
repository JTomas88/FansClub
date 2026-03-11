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

            <div className={`bg-black ${styles.fondoContenido}`}>
                <Jumbotron
                    imagenFondo={{
                        backgroundImage: `url(${imgJumbo})`,
                        backgroundPosition: "center 10%",
                    }}
                    subtitulo={"Ya no se me para el tiempo"}
                    referencia={"home"}
                />

                {/* AQUÍ EMPIEZA EL FONDO DIFERENCIADO */}
                <div>
                    <div className="container pt-5">
                        <CuentaAtras />
                    </div>

                    <div className="text-center mb-3 mt-5">
                        <h4>
                            Videoclip Garra
                        </h4>
                    </div>
                    <div className="w-100 mt-4" style={{ overflow: 'hidden' }}>
                        <div className={styles.video_container}>
                            <iframe
                                src="https://www.youtube.com/embed/SO7tO46Ks8o?si=H25FIR7Izj1MuLl6"
                                title="YouTube video player"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                        <video
                            src={adelantogarra}
                            controls


                            className={`${styles.adelanto_garra}`}
                        />
                    </div>

                    {/* Aquí puedes seguir añadiendo los demás componentes 
                        como SliderHome, Videos, etc. */}
                </div>
            </div>
        </>
    );
};
