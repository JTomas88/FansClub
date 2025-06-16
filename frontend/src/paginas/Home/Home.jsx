import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../../componentes/Seo/Seo";

import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import imgJumbo from "../../assets/imagenes_jumbotron/JumboHome.png";
import { SliderHome } from "../../componentes/Slider/SliderHome";
import { Videos } from "../../componentes/Videos/Videos";
import { AgendaConciertos } from "../../componentes/AgendaConciertos/AgendaConciertos";
import styles from "./home.module.css";
import { Context } from "../../store/AppContext";

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
            <div className="bg-black mb-3">
                <div>
                    <Jumbotron
                        imagenFondo={{
                            backgroundImage: `url(${imgJumbo})`,
                            backgroundPosition: "center 10%",
                        }}
                        subtitulo={"Ya no se me para el tiempo"}
                        referencia={"home"}
                    />

                    {iframeLoaded && (
                        <div className="d-flex justify-content-center align-items-center text-center mt-3">
                            <iframe
                                className={styles.spotify_iframe}
                                style={{ borderRadius: "12px" }}
                                src="https://open.spotify.com/embed/artist/4PSNWFX3rYscMdKRp59uYA?utm_source=generator&theme=0&autoplay=1"
                                width="30%"
                                height="100"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                title="Spotify Artist"
                            ></iframe>
                        </div>
                    )}

                    <div className="mt-3">
                        <SliderHome />
                    </div>
                    <div className="mt-5">
                        <AgendaConciertos />
                    </div>
                    <div className="mt-3">
                        <Videos />
                    </div>
                </div>
            </div>
        </>
    );
};
