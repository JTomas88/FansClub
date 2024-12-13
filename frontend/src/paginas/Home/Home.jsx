import React from "react";
import { Jumbotron } from "../../componentes/Jumbotron/Jumbotron";
import imgJumbo from "../../assets/imagenes_jumbotron/JumboHome.png"
import { SliderHome } from "../../componentes/Slider/SliderHome";
import { Videos } from "../../componentes/Videos/Videos";
import { AgendaConciertos } from "../../componentes/AgendaConciertos/AgendaConciertos";
import styles from "./home.module.css"

export const Home = () => {
    return (
        <div className="bg-color mb-3">
            <div>
                <Jumbotron
                    imagenFondo={{
                        backgroundImage: `url(${imgJumbo})`,
                        backgroundPosition: "center 10%",
                    }}
                    subtitulo={"Ya no se me para el tiempo"}
                    referencia={"home"}
                >
                </Jumbotron>

                <div className="d-flex justify-content-center align-items-center text-center">
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
                    ></iframe>
                </div>


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
    );
};