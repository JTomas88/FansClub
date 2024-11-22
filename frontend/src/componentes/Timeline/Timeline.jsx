import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "../Timeline/timeline.module.css";
import { Context } from "../../store/appContext";
import { Chrono } from "react-chrono";
import portadatragicoyfugaz from "../../assets/portadas_discos/portadatragicoyfugaz.jpg";
import portadatiemposdeimpacto from "../../assets/portadas_discos/portadatiemposdeimpacto.jpg";
import portadamelancolic from "../../assets/portadas_discos/portadamelancolic.jpeg";
import portadatrance from "../../assets/portadas_discos/portadatrance.jpg";

export const Timeline = () => {
    useEffect(() => {
        const addBlurEffect = () => {
            const elements = document.querySelectorAll(".hIeDvv, .dHWHqM");
            elements.forEach((element) => {
                if (!element.querySelector(`.${styles.blurBackground}`)) {
                    const blurDiv = document.createElement("div");
                    blurDiv.className = styles.blurBackground;
                    blurDiv.style.position = "absolute";
                    blurDiv.style.top = "0";
                    blurDiv.style.left = "0";
                    blurDiv.style.right = "0";
                    blurDiv.style.bottom = "0";
                    blurDiv.style.zIndex = "-1";

                    element.insertBefore(blurDiv, element.firstChild);
                }
            });
        };

        const timeoutId = setTimeout(addBlurEffect, 100);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="container mt-5">
            <style>
                {`
            .ToolbarWrapper-sc-cif21b-6 {
                display: none !important; /* Oculta la barra de herramientas */
            }
            .gJAGSz.active {
                background: #ffdf0000;
                color: #007FFF !important;
            }
            .hFrYSD {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1.5rem;
                height: 1.5rem;
                position: absolute;
                top: calc(50%);
                background: #ffffff;
                transform: translateY(-50%) rotate(225deg);
                z-index: -2; /* Cambia el z-index aquí */
                right: -8px;
            }
            .dHWHqM {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1.5rem;
                height: 1.5rem;
                position: absolute;
                top: calc(50%);
                background: #ffffff;
                transform: translateY(-50%) rotate(225deg);
                z-index: -2;
                left: -8px;
            }
            .TimelineContentDetails-sc-d7qjm1-5 {
                font-size: 0.9rem !important;
                text-align: justify;
            }
            .bzKFtd {
              display: flex;
              align-items: center;
              justify-content: center;   
            }
            .iiIORr {
              align-items: center;
              display: flex;
              flex-direction: column;
              margin: 0 auto;
              margin-top: 0.5em;
              margin-bottom: 0.5em;
              position: relative;
              max-height: 150px;
              overflow-x: hidden;
              overflow-y: auto;
              scrollbar-color: #007FFF default;
              scrollbar-width: thin;
              transition: max-height 0.25s ease-in-out;
              width: calc(95% - 0.5rem);
            }      

                
        `}
            </style>
            <Chrono
                items={[
                    {
                        title: "2008-2009",
                        cardDetailedText: `Álex da sus prrimeros pasos como cantante en concursos infantiles. Más tarde en audiciones a ciegas de "La Voz y en castings como el del musical de "El Rey León"`,
                    },
                    {
                        title: "2017",
                        media: {
                            type: "IMAGE",
                            source: { url: portadatragicoyfugaz },
                        },
                        cardDetailedText: `Debut como Sienna con el álbum Trágico y fugaz`,
                    },
                    {
                        title: "2020",
                        media: {
                            type: "IMAGE",
                            source: { url: portadatiemposdeimpacto },
                        },
                        cardDetailedText: `Tiempos de impacto: Sienna ya forma parte del panorama musical en España`,
                    },
                    {
                        title: "2021",
                        media: {
                            type: "IMAGE",
                            source: { url: portadamelancolic },
                        },
                        cardDetailedText: `Se lanza Melancolic, una introspección a los sentimientos`,
                    },
                    {
                        title: "2024",
                        media: {
                            type: "IMAGE",
                            source: { url: portadatrance },
                        },
                        cardDetailedText: `Se publica Trance: un disco con nuevos sonidos donde se suelta la rabia más humana.`,
                    },
                ].reverse()}
                mode="VERTICAL_ALTERNATING"
                cardHeight={200}
                mediaHeight={200}
                cardWidth={200}
                hideControls={true}
            />
        </div>
    );
};